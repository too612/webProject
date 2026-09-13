export interface MenuItem {
  menuId: string;
  menuName: string;
  menuSummary?: string | null;
  menuImagePath?: string | null;
  menuUrl?: string;
  path: string;
  parentId?: string;
  level: number;
  orderNo: number;
  subMenus?: MenuItem[];
  active?: boolean;
}
