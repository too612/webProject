import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { ChevronDown, ChevronUp, GripVertical, MoreHorizontal, Pencil, Trash2, Users } from "lucide-react";
import { useState } from "react";
import type { OrganizationDepartment } from "./organizationModel";

export type DepartmentNodeData = OrganizationDepartment & {
  childCount: number;
  collapsed: boolean;
  editable: boolean;
  dropMode?: "child" | "before" | "after";
  onToggle: (deptKey: string) => void;
  onEdit: (deptKey: string) => void;
  onRemove: (deptKey: string) => void;
};

export default function DepartmentNode({ data, dragging }: NodeProps<Node<DepartmentNodeData>>) {
  const [menuOpen, setMenuOpen] = useState(false);
  const frame = data.dropMode === "child"
    ? "border-emerald-500 ring-2 ring-emerald-200"
    : data.dropMode
      ? "border-sky-500 ring-2 ring-sky-200"
      : "border-slate-200";
  const dropLabel = data.dropMode === "child"
    ? "하위 부서로 이동"
    : data.dropMode === "before"
      ? "이 부서 앞에 배치"
      : data.dropMode === "after"
        ? "이 부서 뒤에 배치"
        : "";
  return (
    <div
      className={`relative w-64 rounded-2xl border bg-white px-4 py-3 shadow-sm transition ${frame}
        ${data.editable ? "cursor-grab active:cursor-grabbing" : ""} ${dragging ? "opacity-80 shadow-lg" : ""}`}
    >
      {data.dropMode === "before" && (
        <span className="absolute -left-2 inset-y-1 w-1 rounded-full bg-sky-500" aria-hidden="true" />
      )}
      {data.dropMode === "after" && (
        <span className="absolute -right-2 inset-y-1 w-1 rounded-full bg-sky-500" aria-hidden="true" />
      )}
      <Handle type="target" position={Position.Top} className="!border-0 !bg-slate-400" />
      <div className="flex items-start justify-between gap-2">
        <strong className="truncate text-sm text-slate-800">{data.deptNm}</strong>
        {data.editable && (
          <div className="flex shrink-0 items-center gap-0.5">
            <GripVertical className="size-4 text-slate-300" aria-hidden="true" />
            <div className="relative">
              <button type="button" aria-label={`${data.deptNm} 부서 메뉴`} title="부서명 수정 / 비활성화"
                className="nodrag rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                onClick={(event) => { event.stopPropagation(); setMenuOpen((open) => !open); }}>
                <MoreHorizontal className="size-4" />
              </button>
              {menuOpen && (
                <>
                  <button type="button" aria-label="부서 메뉴 닫기"
                    className="nodrag fixed inset-0 z-10 cursor-default"
                    onClick={(event) => { event.stopPropagation(); setMenuOpen(false); }} />
                  <div className="nodrag absolute right-0 z-20 mt-1 w-32 rounded-md border border-slate-200 bg-white p-1 text-xs shadow-lg">
                    <button type="button" className="flex w-full items-center gap-2 rounded px-2 py-1.5 hover:bg-slate-50"
                      onClick={(event) => { event.stopPropagation(); setMenuOpen(false); data.onEdit(data.deptKey); }}>
                      <Pencil className="size-3.5" /> 부서명 수정
                    </button>
                    <button type="button" className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-red-600 hover:bg-red-50"
                      onClick={(event) => { event.stopPropagation(); setMenuOpen(false); data.onRemove(data.deptKey); }}>
                      <Trash2 className="size-3.5" /> 비활성화
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
        <Users className="size-4 text-slate-400" />
        <span>{data.memberCount}명</span>
        {data.chefName && <><span className="text-slate-300">|</span><span className="truncate">{data.chefName}</span></>}
      </div>
      {data.dropMode && (
        <p className={`mt-2 text-[11px] font-semibold ${
          data.dropMode === "child" ? "text-emerald-600" : "text-sky-600"
        }`}>{dropLabel}</p>
      )}
      {data.childCount > 0 && (
        <button
          type="button"
          title={data.collapsed ? "하위 부서 펼치기" : "하위 부서 접기"}
          className={`nodrag absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white ${data.collapsed ? "bg-slate-500" : "bg-emerald-500"}`}
          onClick={(event) => { event.stopPropagation(); data.onToggle(data.deptKey); }}
        >
          {data.childCount} {data.collapsed ? <ChevronDown className="size-3" /> : <ChevronUp className="size-3" />}
        </button>
      )}
      <Handle type="source" position={Position.Bottom} className="!border-0 !bg-slate-400" />
    </div>
  );
}
