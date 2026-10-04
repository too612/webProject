import axios from "axios";
import client from "../api/api.client";
import { resolveExcelGrid } from "./excelRegistry";
import type { ExcelTarget } from "./excelModel";

const pending = new Set<string>();
export async function fn_exportExcel(targets: string | readonly ExcelTarget[], excelnm: string,
  options: { readonly scope?: string; readonly signal?: AbortSignal } = {}): Promise<void> {
  const key = options.scope ?? "__global";
  if (pending.has(key)) throw new Error("엑셀 다운로드가 진행 중입니다.");
  if (!excelnm.trim() || /[\\/:*?"<>|\u0000-\u001f]/.test(excelnm)) throw new Error("엑셀 파일명이 올바르지 않습니다.");
  const requests = typeof targets === "string" ? [{ target: targets }] : targets;
  if (!requests.length) throw new Error("엑셀 대상이 없습니다.");
  const sheets = requests.map(request => {
    const sheet = resolveExcelGrid(request.target, options.scope);
    return { ...sheet, name: "sheetName" in request ? request.sheetName : sheet.name };
  });
  pending.add(key);
  try {
    const response = await client.post<Blob>("/common/excel/download", { fileName: excelnm, sheets },
      { responseType: "blob", signal: options.signal });
    const type = response.headers["content-type"];
    if (typeof type !== "string" || !type.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") || !response.data.size) {
      throw new Error("엑셀 파일 응답이 올바르지 않습니다.");
    }
    const url = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    try {
      link.href = url;
      link.download = /\.xlsx$/i.test(excelnm) ? excelnm : `${excelnm}.xlsx`;
      document.body.appendChild(link);
      link.click();
    } finally {
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  } catch (error) {
    if (axios.isAxiosError<Blob>(error) && error.response?.data instanceof Blob && error.response.data.type.includes("json")) {
      const body: unknown = JSON.parse(await error.response.data.text());
      throw new Error(body && typeof body === "object" && "message" in body && typeof body.message === "string"
        ? body.message : "엑셀 다운로드에 실패했습니다.");
    }
    throw error;
  } finally { pending.delete(key); }
}