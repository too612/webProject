import type { TreeItem, TreeRow } from "./tree.types";

export function buildTreeRows<T>(
  items: TreeItem<T>[],
  collapsed: Set<string>,
): TreeRow<T>[] {
  const children = new Map<string | null, TreeItem<T>[]>();
  items.forEach((item) => {
    const siblings = children.get(item.parentId) ?? [];
    siblings.push(item);
    children.set(item.parentId, siblings);
  });

  const rows: TreeRow<T>[] = [];
  const visited = new Set<string>();
  const hidden = new Set<string>();
  const hideDescendants = (id: string, ancestors: Set<string>) => {
    if (ancestors.has(id)) return;
    const path = new Set(ancestors);
    path.add(id);
    (children.get(id) ?? []).forEach((child) => {
      hidden.add(child.id);
      hideDescendants(child.id, path);
    });
  };
  const append = (
    item: TreeItem<T>,
    depth: number,
    isLastSibling: boolean,
    ancestorHasNextSibling: boolean[],
  ) => {
    if (visited.has(item.id)) return;
    visited.add(item.id);
    const childItems = children.get(item.id) ?? [];
    rows.push({
      ...item,
      depth,
      hasChildren: childItems.length > 0,
      isLastSibling,
      ancestorHasNextSibling,
    });
    if (!collapsed.has(item.id)) {
      childItems.forEach((child, index) => append(
        child,
        depth + 1,
        index === childItems.length - 1,
        [...ancestorHasNextSibling, !isLastSibling],
      ));
    } else {
      hideDescendants(item.id, new Set());
    }
  };

  const roots = children.get(null) ?? [];
  roots.forEach((item, index) => append(
    item,
    0,
    index === roots.length - 1,
    [],
  ));
  items
    .filter((item) => !visited.has(item.id) && !hidden.has(item.id))
    .forEach((item) => append(item, 0, true, []));
  return rows;
}
