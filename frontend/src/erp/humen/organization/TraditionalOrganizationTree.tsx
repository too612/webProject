import { ChevronDown, ChevronRight, Pencil, Users } from "lucide-react";
import { useState, type DragEvent } from "react";
import type { OrganizationDepartment } from "./organizationModel";

type TreeRow = {
  department: OrganizationDepartment;
  depth: number;
  hasChildren: boolean;
  isLastSibling: boolean;
  ancestorHasNextSibling: boolean[];
};

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

type TreeDropIntent = {
  targetKey: string;
  mode: "before" | "child" | "after";
};

function flattenTree(departments: OrganizationDepartment[], collapsed: Set<string>): TreeRow[] {
  const children = new Map<string | null, OrganizationDepartment[]>();
  departments.forEach((department) => {
    const parentKey = department.parentDeptKey ?? null;
    const siblings = children.get(parentKey) ?? [];
    siblings.push(department);
    children.set(parentKey, siblings);
  });

  const rows: TreeRow[] = [];
  const visited = new Set<string>();
  const append = (
    department: OrganizationDepartment,
    depth: number,
    isLastSibling: boolean,
    ancestorHasNextSibling: boolean[],
  ) => {
    if (visited.has(department.deptKey)) return;
    visited.add(department.deptKey);
    const childDepartments = children.get(department.deptKey) ?? [];
    rows.push({
      department,
      depth,
      hasChildren: childDepartments.length > 0,
      isLastSibling,
      ancestorHasNextSibling,
    });
    if (!collapsed.has(department.deptKey)) {
      childDepartments.forEach((child, index) => append(
        child,
        depth + 1,
        index === childDepartments.length - 1,
        [...ancestorHasNextSibling, !isLastSibling],
      ));
    }
  };

  const roots = children.get(null) ?? [];
  roots.forEach((department, index) => append(
    department,
    0,
    index === roots.length - 1,
    [],
  ));
  departments
    .filter((department) => !visited.has(department.deptKey))
    .forEach((department) => append(department, 0, true, []));
  return rows;
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
  const rows = flattenTree(departments, collapsed);
  const [draggedKey, setDraggedKey] = useState("");
  const [dropIntent, setDropIntent] = useState<TreeDropIntent | null>(null);
  const [rootDropActive, setRootDropActive] = useState(false);

  const siblings = (parentKey: string | null | undefined, excludedKey: string) =>
    departments
      .filter((department) =>
        (department.parentDeptKey ?? null) === (parentKey ?? null)
        && department.deptKey !== excludedKey)
      .sort((left, right) =>
        left.sortOrder - right.sortOrder || left.deptCd.localeCompare(right.deptCd));

  const finishDrag = () => {
    setDraggedKey("");
    setDropIntent(null);
    setRootDropActive(false);
  };

  const dropOnDepartment = async (
    event: DragEvent<HTMLTableRowElement>,
    target: OrganizationDepartment,
  ) => {
    event.preventDefault();
    const intent = dropIntent;
    const sourceKey = draggedKey;
    if (!intent || !sourceKey || sourceKey === target.deptKey) {
      finishDrag();
      return;
    }
    let parentKey: string | null;
    let targetIndex: number;
    if (intent.mode === "child") {
      parentKey = target.deptKey;
      targetIndex = siblings(parentKey, sourceKey).length;
    } else {
      parentKey = target.parentDeptKey ?? null;
      const targetSiblings = siblings(parentKey, sourceKey);
      const index = targetSiblings.findIndex(
        (department) => department.deptKey === target.deptKey,
      );
      targetIndex = Math.max(index, 0) + (intent.mode === "after" ? 1 : 0);
    }
    finishDrag();
    await onMove(sourceKey, parentKey, targetIndex);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-300 bg-white">
      {editable && (
        <div
          className={`border-b-2 border-dashed px-4 py-2 text-center text-xs font-semibold transition ${
            rootDropActive
              ? "border-violet-500 bg-violet-100 text-violet-700"
              : "border-slate-300 bg-slate-50 text-slate-500"
          }`}
          onDragOver={(event) => {
            event.preventDefault();
            setRootDropActive(true);
            setDropIntent(null);
          }}
          onDragLeave={() => setRootDropActive(false)}
          onDrop={(event) => {
            event.preventDefault();
            const sourceKey = draggedKey;
            finishDrag();
            if (sourceKey) {
              void onMove(sourceKey, null, siblings(null, sourceKey).length);
            }
          }}
        >
          여기에 놓으면 최상위 조직으로 이동합니다
        </div>
      )}
      <div className="max-h-[36rem] overflow-auto">
        <table className="w-full min-w-[42rem] table-fixed border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-slate-100 text-xs font-semibold text-slate-600">
            <tr>
              <th className="w-16 border-b border-r border-slate-300 px-3 py-2 text-center">번호</th>
              <th className="w-24 border-b border-r border-slate-300 px-3 py-2 text-center">상태</th>
              <th className="w-36 border-b border-r border-slate-300 px-3 py-2 text-center">조직코드</th>
              <th className="border-b border-slate-300 px-3 py-2 text-left">조직도</th>
              <th className="w-32 border-b border-l border-slate-300 px-3 py-2 text-center">부서장</th>
              <th className="w-20 border-b border-l border-slate-300 px-3 py-2 text-right">인원</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({
              department,
              depth,
              hasChildren,
              isLastSibling,
              ancestorHasNextSibling,
            }, index) => {
              const selected = department.deptKey === selectedKey;
              const expanded = hasChildren && !collapsed.has(department.deptKey);
              return (
                <tr
                  key={department.deptKey}
                  draggable={editable}
                  className={`cursor-pointer border-b border-slate-200 transition-colors ${
                    selected ? "bg-sky-50 outline outline-1 -outline-offset-1 outline-sky-400" : "hover:bg-slate-50"
                  } ${
                    dropIntent?.targetKey === department.deptKey
                      ? dropIntent.mode === "child"
                        ? "outline outline-2 -outline-offset-2 outline-emerald-500"
                        : dropIntent.mode === "before"
                          ? "border-t-2 border-t-sky-500"
                          : "border-b-2 border-b-sky-500"
                      : ""
                  } ${
                    draggedKey === department.deptKey ? "opacity-50" : ""
                  }`}
                  onClick={() => onSelect(department.deptKey)}
                  onDoubleClick={() => { if (editable) onEdit(department.deptKey); }}
                  onDragStart={(event) => {
                    setDraggedKey(department.deptKey);
                    event.dataTransfer.effectAllowed = "move";
                    event.dataTransfer.setData("text/plain", department.deptKey);
                  }}
                  onDragEnd={finishDrag}
                  onDragOver={(event) => {
                    if (!editable || draggedKey === department.deptKey) return;
                    event.preventDefault();
                    event.dataTransfer.dropEffect = "move";
                    const rect = event.currentTarget.getBoundingClientRect();
                    const relativeY = (event.clientY - rect.top) / rect.height;
                    setRootDropActive(false);
                    setDropIntent({
                      targetKey: department.deptKey,
                      mode: relativeY < 0.3
                        ? "before"
                        : relativeY > 0.7
                          ? "after"
                          : "child",
                    });
                  }}
                  onDrop={(event) => {
                    void dropOnDepartment(event, department);
                  }}
                >
                  <td className="border-r border-slate-200 px-3 py-2 text-center text-slate-500">{index + 1}</td>
                  <td className="border-r border-slate-200 px-3 py-2 text-center">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      department.useYn === "Y"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      {department.useYn === "Y" ? "사용" : "미사용"}
                    </span>
                  </td>
                  <td className="border-r border-slate-200 px-3 py-2 text-center font-mono text-xs text-slate-600">
                    {department.deptCd}
                  </td>
                  <td className="relative px-3 py-2">
                    {ancestorHasNextSibling.map((hasNextSibling, ancestorDepth) => (
                      hasNextSibling && ancestorDepth > 0 && (
                        <span
                          key={ancestorDepth}
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-y-0 w-px bg-slate-300"
                          style={{ left: `${22 + (ancestorDepth - 1) * 24}px` }}
                        />
                      )
                    ))}
                    {depth > 0 && (
                      <>
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute top-0 w-px bg-slate-300"
                          style={{
                            bottom: isLastSibling ? "50%" : 0,
                            left: `${22 + (depth - 1) * 24}px`,
                          }}
                        />
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute h-px w-[14px] bg-slate-300"
                          style={{
                            left: `${22 + (depth - 1) * 24}px`,
                            top: "50%",
                          }}
                        />
                      </>
                    )}
                    {expanded && (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute bottom-0 w-px bg-slate-300"
                        style={{
                          left: `${22 + depth * 24}px`,
                          top: "50%",
                        }}
                      />
                    )}
                    <div className="relative flex min-w-0 items-center" style={{ paddingLeft: `${depth * 24}px` }}>
                      {hasChildren ? (
                        <button
                          type="button"
                          aria-label={collapsed.has(department.deptKey) ? "하위 조직 펼치기" : "하위 조직 접기"}
                          className="mr-1 flex size-5 shrink-0 items-center justify-center rounded border border-slate-300 bg-white text-slate-500 hover:bg-slate-100"
                          onClick={(event) => {
                            event.stopPropagation();
                            onToggle(department.deptKey);
                          }}
                        >
                          {collapsed.has(department.deptKey)
                            ? <ChevronRight className="size-3.5" />
                            : <ChevronDown className="size-3.5" />}
                        </button>
                      ) : (
                        <span className="mr-1 size-5 shrink-0" />
                      )}
                      <span className="truncate font-medium text-slate-700">{department.deptNm}</span>
                      {editable && selected && (
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
                      )}
                    </div>
                  </td>
                  <td className="border-l border-slate-200 px-3 py-2 text-center text-xs text-slate-600">
                    {department.chefName ?? "-"}
                  </td>
                  <td className="border-l border-slate-200 px-3 py-2 text-right text-xs text-slate-600">
                    <span className="inline-flex items-center gap-1">
                      <Users className="size-3.5 text-slate-400" />
                      {department.memberCount}
                    </span>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-16 text-center text-sm text-slate-400">
                  등록된 부서가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-end border-t border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
        {rows.length} / {departments.length}개 조직
      </div>
    </div>
  );
}
