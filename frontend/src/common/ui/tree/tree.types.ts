import type { ReactNode } from "react";

export type TreeItem<T> = {
  id: string;
  parentId: string | null;
  label: string;
  data: T;
};

export type TreeRow<T> = TreeItem<T> & {
  depth: number;
  hasChildren: boolean;
  isLastSibling: boolean;
  ancestorHasNextSibling: boolean[];
};

type TreeColumnBase = {
  key: string;
  header: ReactNode;
  headerClassName?: string;
  cellClassName?: string;
};

export type TreeLabelColumn = TreeColumnBase & {
  type: "tree";
};

export type TreeDataColumn<T> = TreeColumnBase & {
  type: "data";
  render: (item: T, index: number) => ReactNode;
};

export type TreeColumn<T> = TreeLabelColumn | TreeDataColumn<T>;

export type TreeMovePosition = "before" | "inside" | "after";
