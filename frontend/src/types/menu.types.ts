export interface MenuItem {
    menuId: string;
    menuName: string;
    menuUrl?: string;
    path: string;
    parentId?: string;
    level: number;
    orderNo: number;
    subMenus?: MenuItem[];
    active?: boolean;
}
