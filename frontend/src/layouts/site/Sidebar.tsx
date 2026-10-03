import { Link, useLocation } from "react-router-dom";
import type { MenuItem } from "../../common/menu/menu.types";
import { buildMenuLink, menuParamMatches } from "../../common/menu/menuModel";

type SidebarProps = Readonly<{
  items: MenuItem[];
}>;

export default function Sidebar({ items }: SidebarProps) {
  const location = useLocation();

  const normalizePath = (path: string) => {
    if (!path) return "/";
    if (path.length > 1 && path.endsWith("/")) {
      return path.slice(0, -1);
    }
    return path;
  };

  const isPathActive = (item: MenuItem) => {
    const currentPath = normalizePath(location.pathname);
    const targetPath = normalizePath(item.path || item.menuUrl || "/");

    if (currentPath === targetPath) {
      return !item.param || menuParamMatches(item.param, location.search);
    }

    return targetPath !== "/" && currentPath.startsWith(`${targetPath}/`);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="sidebar" aria-label="서브 메뉴">
      <ul className="sidebar-menu">
        {items.map((item) => {
          const targetPath = buildMenuLink(item);
          const isActive = Boolean(item.active) || isPathActive(item);
          return (
            <li key={item.menuId} className={isActive ? "is-active" : ""}>
              <Link
                to={targetPath}
                className={isActive ? "active" : ""}
                aria-current={isActive ? "page" : undefined}
              >
                {item.menuName}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
