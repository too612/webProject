import { Pencil, Users } from "lucide-react";
import TreeTable from "../../../common/ui/tree/TreeTable";
import type { TreeColumn, TreeItem, TreeMovePosition } from "../../../common/ui/tree/tree.types";
import type { OrganizationDepartment } from "./organizationModel";

type TraditionalOrganizationTreeProps = {
  departments: OrganizationDepartment[];
  collapsed: Set<string>;
  selectedKey: string;
  editable: boolean;
  onToggle: (key: string) => void;
  onSelect: (key: string) => void;
  onEdit: (key: string) => void;
  onMove: (
    deptKey: string,
    parentDeptKey: string | null,
    targetIndex: number,
  ) => Promise<void>;
};

function toTreeItems(
  departments: OrganizationDepartment[],
): TreeItem<OrganizationDepartment>[] {
  return departments.map((department) => ({
    id: department.deptKey,
    parentId: department.parentDeptKey ?? null,
    label: department.deptNm,
    data: department,
  }));
}

export default function TraditionalOrganizationTree({
  departments,
  collapsed,
  selectedKey,
  editable,
  onToggle,
  onSelect,
  onEdit,
  onMove,
}: TraditionalOrganizationTreeProps) {
  const items = toTreeItems(departments);
  const columns: TreeColumn<OrganizationDepartment>[] = [
    {
      type: "data",
      key: "number",
      header: "번호",
      headerClassName: "w-16 border-r border-slate-300 text-center",
      cellClassName: "border-r border-slate-200 px-3 py-2 text-center text-slate-500",
      render: (_department, index) => index + 1,
    },
    {
      type: "data",
      key: "status",
      header: "상태",
      headerClassName: "w-24 border-r border-slate-300 text-center",
      cellClassName: "border-r border-slate-200 px-3 py-2 text-center",
      render: (department) => (
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
          department.useYn === "Y"
            ? "bg-emerald-50 text-emerald-700"
            : "bg-slate-100 text-slate-500"
        }`}>
          {department.useYn === "Y" ? "사용" : "미사용"}
        </span>
      ),
    },
    {
      type: "data",
      key: "code",
      header: "조직코드",
      headerClassName: "w-36 border-r border-slate-300 text-center",
      cellClassName: "border-r border-slate-200 px-3 py-2 text-center font-mono text-xs text-slate-600",
      render: (department) => department.deptCd,
    },
    {
      type: "tree",
      key: "department",
      header: "조직도",
      headerClassName: "text-left",
    },
    {
      type: "data",
      key: "chef",
      header: "부서장",
      headerClassName: "w-32 border-l border-slate-300 text-center",
      cellClassName: "border-l border-slate-200 px-3 py-2 text-center text-xs text-slate-600",
      render: (department) => department.chefName ?? "-",
    },
    {
      type: "data",
      key: "members",
      header: "인원",
      headerClassName: "w-20 border-l border-slate-300 text-right",
      cellClassName: "border-l border-slate-200 px-3 py-2 text-right text-xs text-slate-600",
      render: (department) => (
        <span className="inline-flex items-center gap-1">
          <Users className="size-3.5 text-slate-400" />
          {department.memberCount}
        </span>
      ),
    },
  ];

  const moveItem = async (
    sourceId: string,
    targetId: string | null,
    position: TreeMovePosition,
  ) => {
    const siblings = (parentId: string | null) => items
      .filter((item) => item.parentId === parentId && item.id !== sourceId);
    if (targetId === null) {
      await onMove(sourceId, null, siblings(null).length);
      return;
    }

    const target = items.find((item) => item.id === targetId);
    if (!target) return;
    if (position === "inside") {
      await onMove(sourceId, targetId, siblings(targetId).length);
      return;
    }

    const parentId = target.parentId;
    const targetSiblings = siblings(parentId);
    const targetIndex = targetSiblings.findIndex((item) => item.id === targetId);
    await onMove(
      sourceId,
      parentId,
      Math.max(targetIndex, 0) + (position === "after" ? 1 : 0),
    );
  };

  return (
    <TreeTable
      items={items}
      columns={columns}
      collapsed={collapsed}
      selectedId={selectedKey}
      onToggle={onToggle}
      onSelect={onSelect}
      onActivate={editable ? onEdit : undefined}
      onMove={editable ? moveItem : undefined}
      renderTreeAction={(department, selected) => editable && selected ? (
        <button
          type="button"
          className="ml-2 rounded p-1 text-slate-400 hover:bg-white hover:text-slate-700"
          title="부서 정보 수정"
          onClick={(event) => {
            event.stopPropagation();
            onEdit(department.deptKey);
          }}
        >
          <Pencil className="size-3.5" />
        </button>
      ) : null}
      emptyMessage="등록된 부서가 없습니다."
      rootDropMessage="여기에 놓으면 최상위 조직으로 이동합니다"
      summaryLabel="개 조직"
    />
  );
}
