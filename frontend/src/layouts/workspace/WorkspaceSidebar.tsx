import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Building2,
  CalendarDays,
  ChartNoAxesCombined,
  ChevronDown,
  ChevronRight,
  FileText,
  ChevronsDownUp,
  ChevronsUpDown,
  ClipboardList,
  GraduationCap,
  HandHeart,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings2,
  Star,
  Users,
  Wallet,
  X,
} from "lucide-react";
import type { MenuItem } from "../../common/menu/menu.types";
import { buildMenuLink } from "../../common/menu/menuModel";
import { flattenWorkspaceMenus } from "../../common/workspace/workspaceModel";
import type {
  WorkspaceMenuPresentation,
  WorkspacePreferences,
} from "../../common/workspace/workspace.types";
import {
  Checkbox,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../common/ui";

type Props = Readonly<{
  menus: MenuItem[];
  currentGroupId?: string;
  currentMenuId?: string;
  preferences: WorkspacePreferences;
  menuPresentation?: WorkspaceMenuPresentation;
  mobileOpen: boolean;
  loading: boolean;
  onOpen: (href: string) => void;
  onFavorite: (id: string) => void;
  onToggleGroup: (id: string) => void;
  onCollapse: () => void;
  onMobileClose: () => void;
}>;

const groupIcons = [
  Users,
  BookOpen,
  Wallet,
  GraduationCap,
  HandHeart,
  CalendarDays,
  Building2,
  MessageSquare,
  ChartNoAxesCombined,
  ClipboardList,
];

function filterTree(items: MenuItem[], query: string): MenuItem[] {
  return items.flatMap((item) => {
    if (item.menuName.toLocaleLowerCase().includes(query)) return [item];
    const children = filterTree(item.subMenus ?? [], query);
    return children.length ? [{ ...item, subMenus: children }] : [];
  });
}

export default function WorkspaceSidebar({
  menus,
  currentGroupId,
  currentMenuId,
  preferences,
  menuPresentation,
  mobileOpen,
  loading,
  onOpen,
  onFavorite,
  onToggleGroup,
  onCollapse,
  onMobileClose,
}: Props) {
  const [groupId, setGroupId] = useState(currentGroupId ?? "");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string[]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  useEffect(() => {
    if (currentGroupId) setGroupId(currentGroupId);
  }, [currentGroupId]);
  const visibleGroups = menus.filter(
    (menu) => !preferences.hiddenGroups.includes(menu.menuId),
  );
  const selected =
    visibleGroups.find((menu) => menu.menuId === groupId) ?? visibleGroups[0];
  useEffect(() => {
    setExpanded(
      flattenWorkspaceMenus(selected?.subMenus ?? [])
        .filter((menu) => menu.subMenus?.length)
        .map((menu) => menu.menuId),
    );
  }, [selected?.menuId]);
  const allMenus = flattenWorkspaceMenus(menus);
  const normalizedQuery = query.trim().toLocaleLowerCase();
  let source: MenuItem[] = [];
  if (favoritesOnly) {
    source = allMenus.filter((menu) =>
      preferences.favorites.includes(menu.menuId),
    );
  } else if (normalizedQuery) {
    source = menus;
  } else if (selected) {
    source = selected.subMenus?.length ? selected.subMenus : [selected];
  }
  const tree = normalizedQuery ? filterTree(source, normalizedQuery) : source;
  const toggle = (id: string) =>
    setExpanded((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  const expandMenuPanel = () => {
    if (preferences.sidebarCollapsed && !mobileOpen) onCollapse();
  };
  const renderTree = (items: MenuItem[]) => (
    <ul className="workspace-tree-list">
      {items.map((menu) => {
        const children = menu.subMenus ?? [];
        const isOpen = !!normalizedQuery || expanded.includes(menu.menuId);
        const toggleLabel = menu.menuName + (isOpen ? " 접기" : " 펼치기");
        const favoriteLabel = menu.menuName + " 즐겨찾기";
        return (
          <li key={menu.menuId}>
            <div
              className={cn(
                "workspace-tree-row",
                currentMenuId === menu.menuId && "is-active",
              )}
            >
              {children.length > 0 ? (
                <button
                  type="button"
                  className="workspace-icon workspace-tree-toggle"
                  title={toggleLabel}
                  aria-label={toggleLabel}
                  aria-expanded={isOpen}
                  onClick={() => toggle(menu.menuId)}
                >
                  {isOpen ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </button>
              ) : (
                <span className="workspace-tree-leaf" aria-hidden="true">
                  <FileText size={13} />
                </span>
              )}
              <button
                type="button"
                className="workspace-menu-link"
                title={menu.menuName}
                aria-expanded={children.length > 0 ? isOpen : undefined}
                aria-current={
                  currentMenuId === menu.menuId ? "page" : undefined
                }
                onClick={() =>
                  children.length
                    ? toggle(menu.menuId)
                    : onOpen(buildMenuLink(menu))
                }
              >
                {menu.menuName}
              </button>
              {!children.length && (
                <button
                  type="button"
                  className="workspace-icon workspace-star"
                  aria-label={favoriteLabel}
                  title={favoriteLabel}
                  aria-pressed={preferences.favorites.includes(menu.menuId)}
                  onClick={() => onFavorite(menu.menuId)}
                >
                  <Star
                    size={14}
                    fill={
                      preferences.favorites.includes(menu.menuId)
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>
              )}
            </div>
            {children.length > 0 && isOpen && renderTree(children)}
          </li>
        );
      })}
    </ul>
  );
  const emptyMessage = normalizedQuery
    ? "검색 결과가 없습니다."
    : "메뉴가 없습니다.";
  let treeContent = <p className="workspace-menu-empty">{emptyMessage}</p>;
  if (loading) {
    treeContent = <p className="workspace-menu-empty">불러오는 중...</p>;
  } else if (tree.length) {
    treeContent = renderTree(tree);
  }

  return (
    <>
      {mobileOpen && (
        <button
          className="workspace-menu-backdrop"
          type="button"
          aria-label="메뉴 닫기"
          onClick={onMobileClose}
        />
      )}
      <aside
        id="workspace-navigation"
        className={cn(
          "workspace-sidebar",
          preferences.sidebarCollapsed && "is-collapsed",
          mobileOpen && "is-mobile-open",
        )}
        aria-label="작업공간 메뉴"
      >
        <nav className="workspace-groups" aria-label="대분류">
          {preferences.sidebarCollapsed && (
            <button
              type="button"
              className="workspace-rail-expand"
              title="메뉴 영역 펼치기"
              aria-label="메뉴 영역 펼치기"
              onClick={onCollapse}
            >
              <PanelLeftOpen size={20} />
            </button>
          )}
          {visibleGroups.map((menu) => {
            const presentation = Object.entries(menuPresentation ?? {}).find(
              ([path]) =>
                menu.path === path || menu.path.startsWith(path + "/"),
            )?.[1];
            const Icon =
              presentation?.icon ??
              groupIcons[menus.indexOf(menu) % groupIcons.length];
            return (
              <button
                key={menu.menuId}
                type="button"
                title={menu.menuName}
                aria-label={menu.menuName}
                aria-pressed={
                  selected?.menuId === menu.menuId && !favoritesOnly
                }
                className={
                  selected?.menuId === menu.menuId && !favoritesOnly
                    ? "is-active"
                    : ""
                }
                onClick={() => {
                  setGroupId(menu.menuId);
                  setFavoritesOnly(false);
                  expandMenuPanel();
                }}
              >
                <Icon size={21} />
                <span>
                  {presentation?.label ??
                    (menu.menuName.replace(/관리|시스템/g, "").slice(0, 4) ||
                      menu.menuName.slice(0, 4))}
                </span>
              </button>
            );
          })}
          <button
            type="button"
            title="즐겨찾기"
            aria-label="즐겨찾기"
            aria-pressed={favoritesOnly}
            className={favoritesOnly ? "is-active" : ""}
            onClick={() => {
              setFavoritesOnly(true);
              expandMenuPanel();
            }}
          >
            <Star size={21} />
            <span>즐겨찾기</span>
          </button>
          <button
            type="button"
            title="메뉴 설정"
            aria-label="메뉴 설정"
            onClick={() => setSettingsOpen(true)}
          >
            <Settings2 size={21} />
            <span>설정</span>
          </button>
        </nav>
        <div className="workspace-menu-panel">
          <div className="workspace-menu-heading">
            <strong>
              {favoritesOnly ? "즐겨찾기" : (selected?.menuName ?? "메뉴")}
            </strong>
            <button
              type="button"
              className="workspace-icon workspace-desktop-collapse"
              title="메뉴 영역 접기"
              aria-label="메뉴 영역 접기"
              onClick={onCollapse}
            >
              <PanelLeftClose size={18} />
            </button>
            <button
              type="button"
              className="workspace-icon workspace-mobile-close"
              title="메뉴 닫기"
              aria-label="메뉴 닫기"
              onClick={onMobileClose}
            >
              <X size={18} />
            </button>
          </div>
          <label className="workspace-menu-search">
            <Search size={16} />
            <input
              value={query}
              aria-label="메뉴 검색"
              placeholder="메뉴 검색"
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && (
              <button
                type="button"
                className="workspace-icon"
                aria-label="검색 지우기"
                title="검색 지우기"
                onClick={() => setQuery("")}
              >
                <X size={14} />
              </button>
            )}
          </label>
          <div className="workspace-tree-toolbar">
            <span>{normalizedQuery ? "검색 결과" : "세부 메뉴"}</span>
            <button
              type="button"
              className="workspace-icon"
              title="전체 펼치기"
              aria-label="전체 펼치기"
              onClick={() => setExpanded(allMenus.map((menu) => menu.menuId))}
            >
              <ChevronsUpDown size={16} />
            </button>
            <button
              type="button"
              className="workspace-icon"
              title="전체 접기"
              aria-label="전체 접기"
              disabled={!!normalizedQuery}
              onClick={() => setExpanded([])}
            >
              <ChevronsDownUp size={16} />
            </button>
          </div>
          <div className="workspace-tree">{treeContent}</div>
        </div>
      </aside>
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>대분류 표시 설정</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            {menus.map((menu) => (
              <label
                key={menu.menuId}
                className="flex items-center gap-3 text-sm"
              >
                <Checkbox
                  checked={!preferences.hiddenGroups.includes(menu.menuId)}
                  disabled={
                    visibleGroups.length === 1 &&
                    !preferences.hiddenGroups.includes(menu.menuId)
                  }
                  onCheckedChange={() => onToggleGroup(menu.menuId)}
                />
                {menu.menuName}
              </label>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
