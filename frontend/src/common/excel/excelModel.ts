export interface ExcelRowRef { readonly token: string; readonly index: number }
export interface ExcelColumn { readonly id: string; readonly title: string; readonly width: number }
export interface ExcelBlock { readonly token: string; readonly indexes: readonly number[] }
export interface ExcelSheet {
  readonly name: string;
  readonly columns: readonly ExcelColumn[];
  readonly blocks: readonly ExcelBlock[];
}
export interface ExcelTarget { readonly target: string; readonly sheetName: string }
export interface ExcelGridSource<T> {
  readonly scope: string;
  readonly id: string;
  readonly classNames?: readonly string[];
  readonly sheetName: string;
  readonly getRowRef: (row: T) => ExcelRowRef | undefined;
  readonly getEmptyToken: () => string | undefined;
}