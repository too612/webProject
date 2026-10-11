import { useEffect, useMemo, useRef, useState } from "react";
import {
  applyNodeChanges,
  Background,
  Controls,
  ReactFlow,
  type Edge,
  type Node,
  type OnNodeDrag,
  type OnNodesChange,
  type NodeTypes,
  type ReactFlowInstance,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Maximize2,
  MousePointerClick,
  Plus,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import {
  ActionButton,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  ListPageShell,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../common/ui";
import { useWorkspaceDirty } from "../../../common/workspace/workspaceHook";
import DepartmentNode, { type DepartmentNodeData } from "./DepartmentNode";
import { organizationApi } from "./organizationApi";
import { useOrganizationPage } from "./organizationHook";
import type { OrganizationDepartment } from "./organizationModel";
import TraditionalOrganizationTree from "./TraditionalOrganizationTree";

const nodeTypes: NodeTypes = { department: DepartmentNode };

type DropIntent =
  | { mode: "root" }
  | { mode: "child" | "before" | "after"; targetKey: string };

function createGraph(
  departments: OrganizationDepartment[],
  collapsed: Set<string>,
  editable: boolean,
  onToggle: (key: string) => void,
  onEdit: (key: string) => void,
  onRemove: (key: string) => void,
) {
  const children = new Map<string | null, OrganizationDepartment[]>();
  departments.forEach((department) => {
    const list = children.get(department.parentDeptKey ?? null) ?? [];
    list.push(department);
    children.set(department.parentDeptKey ?? null, list);
  });
  const hidden = new Set<string>();
  const hideDescendants = (key: string) => {
    (children.get(key) ?? []).forEach((child) => {
      hidden.add(child.deptKey);
      hideDescendants(child.deptKey);
    });
  };
  collapsed.forEach(hideDescendants);
  const visible = departments.filter(
    (department) => !hidden.has(department.deptKey),
  );
  const visibleKeys = new Set(visible.map((department) => department.deptKey));
  const positions = new Map<string, { x: number; y: number }>();
  let nextLeaf = 0;
  const place = (
    department: OrganizationDepartment,
    depth: number,
    ancestors: Set<string>,
  ): number => {
    if (positions.has(department.deptKey))
      return positions.get(department.deptKey)!.x;
    if (ancestors.has(department.deptKey)) {
      const x = nextLeaf++ * 300;
      positions.set(department.deptKey, { x, y: depth * 170 });
      return x;
    }
    const path = new Set(ancestors);
    path.add(department.deptKey);
    const visibleChildren = (children.get(department.deptKey) ?? []).filter(
      (child) => visibleKeys.has(child.deptKey),
    );
    const childXs = visibleChildren.map((child) =>
      place(child, depth + 1, path),
    );
    const x =
      childXs.length > 0
        ? (Math.min(...childXs) + Math.max(...childXs)) / 2
        : nextLeaf++ * 300;
    positions.set(department.deptKey, { x, y: depth * 170 });
    return x;
  };
  visible
    .filter(
      (department) =>
        !department.parentDeptKey || !visibleKeys.has(department.parentDeptKey),
    )
    .forEach((department) => place(department, 0, new Set()));
  visible
    .filter((department) => !positions.has(department.deptKey))
    .forEach((department) => place(department, 0, new Set()));

  const nodes: Node<DepartmentNodeData>[] = visible.map((department) => {
    return {
      id: department.deptKey,
      type: "department",
      draggable: editable,
      position: positions.get(department.deptKey) ?? { x: 0, y: 0 },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      data: {
        ...department,
        childCount: children.get(department.deptKey)?.length ?? 0,
        collapsed: collapsed.has(department.deptKey),
        editable,
        dropMode: undefined,
        onToggle,
        onEdit,
        onRemove,
      },
    };
  });
  const edges: Edge[] = visible
    .filter(
      (department) =>
        department.parentDeptKey && visibleKeys.has(department.parentDeptKey),
    )
    .map((department) => ({
      id: `${department.parentDeptKey}-${department.deptKey}`,
      source: department.parentDeptKey!,
      target: department.deptKey,
      type: "smoothstep",
      style: { stroke: "#94a3b8", strokeWidth: 1.5 },
    }));
  return { nodes, edges };
}

export default function OrganizationPage() {
  const {
    items,
    detail,
    selectedKey,
    loading,
    detailLoading,
    error,
    page,
    totalPages,
    totalElements,
    inputKeyword,
    setInputKeyword,
    setSelectedKey,
    search,
    previousPage,
    nextPage,
    reload,
  } = useOrganizationPage();
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [showCreate, setShowCreate] = useState(false);
  const [showDepartmentCreate, setShowDepartmentCreate] = useState(false);
  const [reorgDt, setReorgDt] = useState("");
  const [reorgTitle, setReorgTitle] = useState("");
  const [deptNm, setDeptNm] = useState("");
  const [parentDeptKey, setParentDeptKey] = useState("");
  const [editingKey, setEditingKey] = useState("");
  const [editDeptNm, setEditDeptNm] = useState("");
  const [editEngDeptNm, setEditEngDeptNm] = useState("");
  const [editChefEmpNo, setEditChefEmpNo] = useState("");
  const [editRemark, setEditRemark] = useState("");
  const [busy, setBusy] = useState(false);
  const [flowInstance, setFlowInstance] =
    useState<ReactFlowInstance<Node<DepartmentNodeData>, Edge>>();
  const [nodes, setNodes] = useState<Node<DepartmentNodeData>[]>([]);
  const [dropIntent, setDropIntent] = useState<DropIntent | null>(null);
  const rootDropRef = useRef<HTMLDivElement>(null);
  const [viewTab, setViewTab] = useState("graph");
  const [graphExpanded, setGraphExpanded] = useState(false);
  const [treeCollapsed, setTreeCollapsed] = useState<Set<string>>(new Set());
  const [treeSelectedKey, setTreeSelectedKey] = useState("");

  const beginEdit = (key: string) => {
    const department = detail?.departments.find((item) => item.deptKey === key);
    if (!department) return;
    setEditingKey(key);
    setEditDeptNm(department.deptNm);
    setEditEngDeptNm(department.engDeptNm ?? "");
    setEditChefEmpNo(department.chefEmpNo ?? "");
    setEditRemark(department.remark ?? "");
  };

  const removeDepartment = async (key: string) => {
    if (!detail) return;
    const department = detail.departments.find((item) => item.deptKey === key);
    if (
      !department ||
      !window.confirm(`${department.deptNm} 부서를 비활성화하시겠습니까?`)
    )
      return;
    setBusy(true);
    try {
      await organizationApi.removeDepartment(detail.reorgKey, key);
      toast.success("부서를 비활성화했습니다.");
      await reload();
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "부서 비활성화에 실패했습니다.",
      );
    } finally {
      setBusy(false);
    }
  };

  const graph = useMemo(
    () =>
      createGraph(
        detail?.departments ?? [],
        collapsed,
        detail?.confYn === "N" && detail.useYn === "Y",
        (key) => {
          setCollapsed((current) => {
            const next = new Set(current);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
          });
        },
        beginEdit,
        (key) => {
          void removeDepartment(key);
        },
      ),
    [collapsed, detail],
  );

  const editable = detail?.confYn === "N" && detail.useYn === "Y";

  useEffect(() => {
    setNodes(graph.nodes);
    setDropIntent(null);
  }, [graph.nodes]);

  useEffect(() => {
    setTreeSelectedKey("");
    setTreeCollapsed(new Set());
    setGraphExpanded(false);
  }, [detail?.reorgKey]);

  const onNodesChange: OnNodesChange<Node<DepartmentNodeData>> = (changes) =>
    setNodes((current) => applyNodeChanges(changes, current));

  const renderedNodes = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          dropMode:
            dropIntent &&
            "targetKey" in dropIntent &&
            node.id === dropIntent.targetKey
              ? dropIntent.mode
              : undefined,
        },
      })),
    [nodes, dropIntent],
  );

  const sortedSiblings = (
    parentKey: string | null | undefined,
    excludedKey?: string,
  ) =>
    (detail?.departments ?? [])
      .filter(
        (department) =>
          (department.parentDeptKey ?? null) === (parentKey ?? null),
      )
      .filter((department) => department.deptKey !== excludedKey)
      .sort(
        (left, right) =>
          left.sortOrder - right.sortOrder ||
          left.deptCd.localeCompare(right.deptCd),
      );

  const isRootDrop = (event: MouseEvent | TouchEvent) => {
    const rect = rootDropRef.current?.getBoundingClientRect();
    if (!rect) return false;
    const point = "touches" in event ? event.touches[0] : event;
    return (
      Boolean(point) &&
      point.clientX >= rect.left &&
      point.clientX <= rect.right &&
      point.clientY >= rect.top &&
      point.clientY <= rect.bottom
    );
  };

  const findDropIntent = (
    dragged: Node<DepartmentNodeData>,
  ): DropIntent | null => {
    if (!flowInstance) return null;
    const overlapArea = (other: Node<DepartmentNodeData>) => {
      const aw = dragged.measured?.width ?? 256;
      const ah = dragged.measured?.height ?? 110;
      const bw = other.measured?.width ?? 256;
      const bh = other.measured?.height ?? 110;
      const x =
        Math.min(dragged.position.x + aw, other.position.x + bw) -
        Math.max(dragged.position.x, other.position.x);
      const y =
        Math.min(dragged.position.y + ah, other.position.y + bh) -
        Math.max(dragged.position.y, other.position.y);
      return x > 0 && y > 0 ? x * y : 0;
    };
    let best: { node: Node<DepartmentNodeData>; area: number } | null = null;
    flowInstance.getIntersectingNodes(dragged, true).forEach((candidate) => {
      if (candidate.id === dragged.id) return;
      const area = overlapArea(candidate);
      if (area > 0 && (!best || area > best.area))
        best = { node: candidate, area };
    });
    if (!best) return null;
    const target = (best as { node: Node<DepartmentNodeData> }).node;
    const targetWidth = target.measured?.width ?? 256;
    const draggedWidth = dragged.measured?.width ?? 256;
    const draggedCenter = dragged.position.x + draggedWidth / 2;
    const relativeX = (draggedCenter - target.position.x) / targetWidth;
    return {
      targetKey: target.id,
      mode:
        relativeX < 0.3 ? "before" : relativeX > 0.7 ? "after" : "child",
    };
  };

  const onNodeDrag: OnNodeDrag<Node<DepartmentNodeData>> = (event, node) => {
    setDropIntent(
      isRootDrop(event) ? { mode: "root" } : findDropIntent(node),
    );
  };

  const onNodeDragStop: OnNodeDrag<Node<DepartmentNodeData>> = async (
    event,
    node,
  ) => {
    const intent = isRootDrop(event)
      ? ({ mode: "root" } as const)
      : findDropIntent(node);
    setDropIntent(null);
    const origin = graph.nodes.find((item) => item.id === node.id)?.position;
    const moved =
      !origin ||
      Math.abs(origin.x - node.position.x) > 5 ||
      Math.abs(origin.y - node.position.y) > 5;
    if (!detail || !editable) return;
    if (!intent) {
      setNodes(graph.nodes);
      if (moved)
        toast.info(
          "카드 중앙·좌우 또는 최상위 드롭 영역에 놓아야 변경됩니다.",
        );
      return;
    }
    let parentKey: string | null = null;
    let targetIndex = 0;
    let description = "최상위 조직";
    if (intent.mode === "root") {
      targetIndex = sortedSiblings(null, node.id).length;
    } else {
      const target = detail.departments.find(
        (department) => department.deptKey === intent.targetKey,
      );
      if (!target) {
        setNodes(graph.nodes);
        return;
      }
      if (intent.mode === "child") {
        parentKey = target.deptKey;
        targetIndex = sortedSiblings(parentKey, node.id).length;
        description = `'${target.deptNm}'의 하위`;
      } else {
        parentKey = target.parentDeptKey ?? null;
        const siblings = sortedSiblings(parentKey, node.id);
        const targetSiblingIndex = siblings.findIndex(
          (department) => department.deptKey === target.deptKey,
        );
        targetIndex =
          Math.max(targetSiblingIndex, 0) +
          (intent.mode === "after" ? 1 : 0);
        description = `'${target.deptNm}' ${
          intent.mode === "before" ? "앞" : "뒤"
        }`;
      }
    }
    setBusy(true);
    try {
      await organizationApi.moveDepartment(detail.reorgKey, node.id, {
        parentDeptKey: parentKey,
        targetIndex,
      });
      toast.success(`'${node.data.deptNm}' 부서를 ${description}로 옮겼습니다.`);
      await reload();
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "상위 부서 변경에 실패했습니다.",
      );
      setNodes(graph.nodes);
    } finally {
      setBusy(false);
    }
  };

  useWorkspaceDirty(
    (showCreate && Boolean(reorgDt || reorgTitle)) ||
      (showDepartmentCreate && Boolean(deptNm || parentDeptKey)) ||
      Boolean(editingKey),
  );

  const createReorg = async () => {
    if (!reorgDt) return toast.error("조직개편일을 입력하세요.");
    setBusy(true);
    try {
      const created = await organizationApi.createReorg({
        reorgDt,
        reorgTitle,
      });
      toast.success("조직개편안을 등록했습니다.");
      setShowCreate(false);
      setReorgDt("");
      setReorgTitle("");
      await reload();
      setSelectedKey(created.reorgKey);
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "조직개편안 등록에 실패했습니다.",
      );
    } finally {
      setBusy(false);
    }
  };

  const confirm = async () => {
    if (!detail) return;
    setBusy(true);
    try {
      await organizationApi.confirmReorg(detail.reorgKey);
      toast.success("조직개편안을 확정했습니다.");
      await reload();
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "조직개편안 확정에 실패했습니다.",
      );
    } finally {
      setBusy(false);
    }
  };

  const addDepartment = async () => {
    if (!detail || !deptNm.trim()) return toast.error("부서명을 입력하세요.");
    setBusy(true);
    try {
      await organizationApi.addDepartment(detail.reorgKey, {
        deptNm: deptNm.trim(),
        parentDeptKey: parentDeptKey || undefined,
      });
      toast.success("부서를 추가했습니다.");
      setDeptNm("");
      setParentDeptKey("");
      setShowDepartmentCreate(false);
      await reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "부서 추가에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  };

  const updateDepartment = async () => {
    if (!detail || !editingKey || !editDeptNm.trim())
      return toast.error("부서명을 입력하세요.");
    setBusy(true);
    try {
      await organizationApi.updateDepartment(detail.reorgKey, editingKey, {
        deptNm: editDeptNm.trim(),
        engDeptNm: editEngDeptNm.trim() || undefined,
        chefEmpNo: editChefEmpNo.trim() || undefined,
        remark: editRemark.trim() || undefined,
      });
      toast.success("부서 정보를 수정했습니다.");
      setEditingKey("");
      await reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "부서 수정에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  };

  const showDepartmentCreateForm = (parentKey = "") => {
    setParentDeptKey(parentKey);
    setDeptNm("");
    setShowDepartmentCreate(true);
  };

  const selectedTreeDepartment = detail?.departments.find(
    (department) => department.deptKey === treeSelectedKey,
  );
  const selectedTreeSiblings = selectedTreeDepartment
    ? sortedSiblings(selectedTreeDepartment.parentDeptKey)
    : [];
  const selectedTreeIndex = selectedTreeDepartment
    ? selectedTreeSiblings.findIndex(
        (department) => department.deptKey === selectedTreeDepartment.deptKey,
      )
    : -1;
  const selectedTreeParent = selectedTreeDepartment?.parentDeptKey
    ? detail?.departments.find(
        (department) =>
          department.deptKey === selectedTreeDepartment.parentDeptKey,
      )
    : undefined;

  const moveTreeDepartment = async (
    deptKey: string,
    nextParentKey: string | null,
    targetIndex: number,
  ) => {
    if (!detail || !editable) return;
    const department = detail.departments.find(
      (item) => item.deptKey === deptKey,
    );
    setBusy(true);
    try {
      await organizationApi.moveDepartment(detail.reorgKey, deptKey, {
        parentDeptKey: nextParentKey,
        targetIndex,
      });
      toast.success(`'${department?.deptNm ?? "부서"}' 위치를 변경했습니다.`);
      await reload();
      setTreeSelectedKey(deptKey);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "부서 이동에 실패했습니다.",
      );
    } finally {
      setBusy(false);
    }
  };

  const moveSelectedTreeDepartment = (
    direction: "up" | "down" | "outdent" | "indent" | "root",
  ) => {
    if (!selectedTreeDepartment) return;
    if (direction === "up" && selectedTreeIndex > 0) {
      void moveTreeDepartment(
        selectedTreeDepartment.deptKey,
        selectedTreeDepartment.parentDeptKey ?? null,
        selectedTreeIndex - 1,
      );
      return;
    }
    if (
      direction === "down" &&
      selectedTreeIndex >= 0 &&
      selectedTreeIndex < selectedTreeSiblings.length - 1
    ) {
      void moveTreeDepartment(
        selectedTreeDepartment.deptKey,
        selectedTreeDepartment.parentDeptKey ?? null,
        selectedTreeIndex + 1,
      );
      return;
    }
    if (direction === "indent" && selectedTreeIndex > 0) {
      const previousSibling = selectedTreeSiblings[selectedTreeIndex - 1];
      void moveTreeDepartment(
        selectedTreeDepartment.deptKey,
        previousSibling.deptKey,
        sortedSiblings(previousSibling.deptKey, selectedTreeDepartment.deptKey)
          .length,
      );
      return;
    }
    if (direction === "outdent" && selectedTreeParent) {
      const parentSiblings = sortedSiblings(
        selectedTreeParent.parentDeptKey,
        selectedTreeDepartment.deptKey,
      );
      const parentIndex = parentSiblings.findIndex(
        (department) => department.deptKey === selectedTreeParent.deptKey,
      );
      void moveTreeDepartment(
        selectedTreeDepartment.deptKey,
        selectedTreeParent.parentDeptKey ?? null,
        Math.max(parentIndex, 0) + 1,
      );
      return;
    }
    if (direction === "root") {
      void moveTreeDepartment(
        selectedTreeDepartment.deptKey,
        null,
        sortedSiblings(null, selectedTreeDepartment.deptKey).length,
      );
    }
  };

  const graphCanvas = (expanded: boolean) => (
    <div
      className={
        expanded
          ? "relative min-h-0 flex-1 overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
          : "relative h-[36rem] overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
      }
    >
      {editable && (
        <div
          ref={rootDropRef}
          className={`pointer-events-none absolute left-1/2 top-3 z-10 -translate-x-1/2 rounded-lg border-2 border-dashed px-5 py-2 text-xs font-semibold shadow-sm transition ${
            dropIntent?.mode === "root"
              ? "border-violet-500 bg-violet-100 text-violet-700"
              : "border-slate-300 bg-white/90 text-slate-500"
          }`}
        >
          {dropIntent?.mode === "root"
            ? "놓으면 최상위 조직으로 이동합니다"
            : "최상위 조직으로 이동"}
        </div>
      )}
      {detailLoading ? (
        <div className="flex h-full items-center justify-center text-sm text-slate-400">
          조직도를 불러오는 중...
        </div>
      ) : (
        <ReactFlow
          key={`${detail?.reorgKey ?? "empty"}-${expanded ? "expanded" : "inline"}`}
          nodes={renderedNodes}
          edges={graph.edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
          onNodeDoubleClick={(_event, node) => {
            if (editable) beginEdit(node.id);
          }}
          onInit={setFlowInstance}
          fitView
        >
          <Background gap={24} color="#cbd5e1" />
          <Controls />
        </ReactFlow>
      )}
    </div>
  );

  return (
    <ListPageShell
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCreate((value) => !value)}
          >
            <Plus className="mr-1 size-4" /> 개편안 추가
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!detail || detail.confYn === "Y"}
            onClick={() => {
              if (showDepartmentCreate) {
                setShowDepartmentCreate(false);
              } else {
                showDepartmentCreateForm();
              }
            }}
          >
            <Plus className="mr-1 size-4" /> 부서 추가
          </Button>
          <Button
            size="sm"
            disabled={!detail || detail.confYn === "Y" || busy}
            onClick={confirm}
          >
            <ShieldCheck className="mr-1 size-4" /> 조직개편안 확정
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {showCreate && (
          <div className="flex flex-wrap items-end gap-2 rounded-xl border border-slate-200 bg-white p-3">
            <label className="text-sm text-slate-600">
              개편일
              <input
                type="date"
                value={reorgDt}
                onChange={(e) => setReorgDt(e.target.value)}
                className="mt-1 block rounded-md border border-slate-200 px-2 py-1.5"
              />
            </label>
            <label className="min-w-56 text-sm text-slate-600">
              개편명
              <Input
                value={reorgTitle}
                onChange={(e) => setReorgTitle(e.target.value)}
                placeholder="예: 2026년 하반기 조직개편"
              />
            </label>
            <Button size="sm" disabled={busy} onClick={createReorg}>
              등록
            </Button>
          </div>
        )}
        {showDepartmentCreate && detail && (
          <div className="flex flex-wrap items-end gap-2 rounded-xl border border-slate-200 bg-white p-3">
            <label className="min-w-56 text-sm text-slate-600">
              부서명
              <Input
                value={deptNm}
                onChange={(e) => setDeptNm(e.target.value)}
                placeholder="예: 청년부"
              />
            </label>
            <label className="min-w-56 text-sm text-slate-600">
              상위 부서
              <select
                value={parentDeptKey}
                onChange={(e) => setParentDeptKey(e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-200 px-2 py-2 text-sm"
              >
                <option value="">최상위 부서</option>
                {detail.departments.map((department) => (
                  <option key={department.deptKey} value={department.deptKey}>
                    {department.deptNm}
                  </option>
                ))}
              </select>
            </label>
            <Button size="sm" disabled={busy} onClick={addDepartment}>
              등록
            </Button>
          </div>
        )}
        {editingKey && detail && (
          <Dialog
            open
            onOpenChange={(open) => {
              if (!open) setEditingKey("");
            }}
          >
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>부서 정보 수정</DialogTitle>
                <DialogDescription>
                  부서명과 영문명, 부서장 사번을 변경합니다. 상위 부서는
                  조직도에서 카드를 드래그해 변경하세요.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm text-slate-600">
                  부서명
                  <Input
                    value={editDeptNm}
                    onChange={(e) => setEditDeptNm(e.target.value)}
                    autoFocus
                  />
                </label>
                <label className="text-sm text-slate-600">
                  영문명
                  <Input
                    value={editEngDeptNm}
                    onChange={(e) => setEditEngDeptNm(e.target.value)}
                  />
                </label>
                <label className="text-sm text-slate-600">
                  부서장 사번
                  <Input
                    value={editChefEmpNo}
                    onChange={(e) => setEditChefEmpNo(e.target.value)}
                  />
                </label>
                <label className="text-sm text-slate-600">
                  비고
                  <Input
                    value={editRemark}
                    onChange={(e) => setEditRemark(e.target.value)}
                  />
                </label>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingKey("")}
                >
                  취소
                </Button>
                <Button size="sm" disabled={busy} onClick={updateDepartment}>
                  저장
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}
        <div className="grid gap-4 xl:grid-cols-[18rem_minmax(0,1fr)]">
          <aside className="space-y-3 rounded-xl border border-slate-200 bg-white p-3">
            <form
              className="flex gap-1"
              onSubmit={(e) => {
                e.preventDefault();
                search();
              }}
            >
              <Input
                value={inputKeyword}
                onChange={(e) => setInputKeyword(e.target.value)}
                placeholder="개편명 검색"
              />
              <ActionButton
                action="search"
                type="submit"
                loading={loading}
                className="min-w-0"
              />
            </form>
            <div className="text-xs text-slate-400">총 {totalElements}건</div>
            <div className="space-y-1">
              {items.map((item) => (
                <button
                  type="button"
                  key={item.reorgKey}
                  onClick={() => {
                    setEditingKey("");
                    setSelectedKey(item.reorgKey);
                  }}
                  className={`w-full rounded-lg px-3 py-2 text-left ${selectedKey === item.reorgKey ? "bg-emerald-50 text-emerald-800" : "hover:bg-slate-50"}`}
                >
                  <div className="flex items-center justify-between gap-2 text-sm font-semibold">
                    <span>{item.reorgTitle || "조직개편안"}</span>
                    <span
                      className={`text-[10px] ${item.confYn === "Y" ? "text-emerald-600" : "text-amber-600"}`}
                    >
                      {item.confYn === "Y" ? "확정" : "작성중"}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {item.reorgDt} · 부서 {item.departmentCount}개
                  </div>
                </button>
              ))}
              {!loading && items.length === 0 && (
                <div className="py-8 text-center text-sm text-slate-400">
                  조회된 내역이 없습니다.
                </div>
              )}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={previousPage}
              >
                이전
              </Button>
              <span>
                {page + 1} / {Math.max(totalPages, 1)}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages - 1}
                onClick={nextPage}
              >
                다음
              </Button>
            </div>
          </aside>

          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3">
              <div>
                <strong>
                  {detail?.reorgTitle || "조직개편안을 선택하세요"}
                </strong>
                {detail && (
                  <span className="ml-2 text-sm text-slate-500">
                    {detail.reorgDt} ·{" "}
                    {detail.confYn === "Y" ? "확정됨" : "작성중"}
                  </span>
                )}
              </div>
            </div>
            <Tabs value={viewTab} onValueChange={setViewTab}>
              <TabsList className="grid h-auto w-full grid-cols-2">
                <TabsTrigger value="graph">조직도(UI)</TabsTrigger>
                <TabsTrigger value="tree">조직도(TREE)</TabsTrigger>
              </TabsList>
              <TabsContent value="graph" className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <MousePointerClick className="size-3.5 text-slate-400" />
                    {editable ? (
                      <>
                        <span>
                          <strong className="text-slate-700">
                            부서명 수정
                          </strong>{" "}
                          : 카드를 더블클릭하거나 카드 우측{" "}
                          <strong className="text-slate-700">···</strong> 메뉴
                        </span>
                        <span>
                          <strong className="text-slate-700">
                            위치 변경
                          </strong>{" "}
                          : 카드 중앙은 하위, 좌우는 같은 레벨 앞·뒤, 상단
                          영역은 최상위 이동
                        </span>
                      </>
                    ) : (
                      <span>
                        확정된 조직도는 조회만 가능합니다. 변경하려면 새
                        조직개편안을 등록하세요.
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!detail}
                      onClick={() => void flowInstance?.fitView()}
                    >
                      <RotateCcw className="mr-1 size-3.5" /> 줌 초기화
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!detail}
                      onClick={() => setGraphExpanded(true)}
                    >
                      <Maximize2 className="mr-1 size-3.5" /> 확대보기
                    </Button>
                  </div>
                </div>
                {!graphExpanded && graphCanvas(false)}
              </TabsContent>
              <TabsContent value="tree" className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2">
                  <div className="text-xs text-slate-500">
                    행을 위·가운데·아래에 놓아 앞·하위·뒤로 이동하거나,
                    선택 후 이동 버튼을 사용할 수 있습니다.
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!editable || !selectedTreeDepartment}
                      onClick={() =>
                        showDepartmentCreateForm(
                          selectedTreeDepartment?.deptKey,
                        )
                      }
                    >
                      <Plus className="mr-1 size-3.5" /> 하위 부서 추가
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!editable || !selectedTreeDepartment}
                      onClick={() =>
                        showDepartmentCreateForm(
                          selectedTreeDepartment?.parentDeptKey ?? "",
                        )
                      }
                    >
                      <Plus className="mr-1 size-3.5" /> 동일 레벨 추가
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!editable || !selectedTreeDepartment}
                      onClick={() => {
                        if (selectedTreeDepartment)
                          beginEdit(selectedTreeDepartment.deptKey);
                      }}
                    >
                      부서 수정
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!editable || selectedTreeIndex <= 0 || busy}
                      onClick={() => moveSelectedTreeDepartment("up")}
                    >
                      위로
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={
                        !editable ||
                        selectedTreeIndex < 0 ||
                        selectedTreeIndex >= selectedTreeSiblings.length - 1 ||
                        busy
                      }
                      onClick={() => moveSelectedTreeDepartment("down")}
                    >
                      아래로
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!editable || selectedTreeIndex <= 0 || busy}
                      onClick={() => moveSelectedTreeDepartment("indent")}
                    >
                      한 단계 내리기
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!editable || !selectedTreeParent || busy}
                      onClick={() => moveSelectedTreeDepartment("outdent")}
                    >
                      한 단계 올리기
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={
                        !editable ||
                        !selectedTreeDepartment?.parentDeptKey ||
                        busy
                      }
                      onClick={() => moveSelectedTreeDepartment("root")}
                    >
                      최상위로
                    </Button>
                  </div>
                </div>
                <TraditionalOrganizationTree
                  departments={detail?.departments ?? []}
                  collapsed={treeCollapsed}
                  selectedKey={treeSelectedKey}
                  editable={Boolean(editable)}
                  onToggle={(key) => {
                    setTreeCollapsed((current) => {
                      const next = new Set(current);
                      if (next.has(key)) next.delete(key);
                      else next.add(key);
                      return next;
                    });
                  }}
                  onSelect={setTreeSelectedKey}
                  onEdit={beginEdit}
                  onMove={moveTreeDepartment}
                />
              </TabsContent>
            </Tabs>
            {detail && detail.histories.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="mb-2 text-sm font-semibold">최근 변경 이력</h3>
                {detail.histories.slice(0, 5).map((history) => (
                  <div
                    key={history.deptHistKey}
                    className="flex justify-between border-t border-slate-100 py-2 text-xs text-slate-500"
                  >
                    <span>
                      {history.orgDeptCd} → {history.chgDeptCd} ·{" "}
                      {history.changeNote}
                    </span>
                    <span>{history.regDtm}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <Dialog open={graphExpanded} onOpenChange={setGraphExpanded}>
          <DialogContent className="flex h-[96vh] w-[96vw] max-w-none flex-col gap-3 overflow-hidden p-4 sm:max-w-none">
            <DialogHeader className="pr-10">
              <DialogTitle>
                {detail?.reorgTitle || "조직도 확대보기"}
              </DialogTitle>
              <DialogDescription>
                넓은 작업 공간에서 확대·축소하거나 부서를 드래그해 상위 부서를
                변경할 수 있습니다.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
              <div className="text-xs text-slate-500">
                {editable
                  ? "카드를 새 상위 부서 위에 겹쳐 놓으면 조직이 변경됩니다."
                  : "확정된 조직도는 조회만 가능합니다."}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void flowInstance?.fitView()}
              >
                <RotateCcw className="mr-1 size-3.5" /> 전체 조직 맞춤
              </Button>
            </div>
            {graphExpanded && graphCanvas(true)}
          </DialogContent>
        </Dialog>
      </div>
    </ListPageShell>
  );
}
