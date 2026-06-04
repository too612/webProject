import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import type { MenuItem } from '../common/menu/menu.types';

type SidebarProps = {
  items: MenuItem[];
};

export default function Sidebar({ items }: SidebarProps) {
  const location = useLocation();

  const normalizePath = (path: string) => {
    if (!path) return '/';
    if (path.length > 1 && path.endsWith('/')) {
      return path.slice(0, -1);
    }
    return path;
  };

  const isPathActive = (itemPath: string) => {
    const currentPath = normalizePath(location.pathname);
    const targetPath = normalizePath(itemPath);

    if (currentPath === targetPath) {
      return true;
    }

    return targetPath !== '/' && currentPath.startsWith(`${targetPath}/`);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="sidebar" aria-label="서브 메뉴">
      <ul className="sidebar-menu">
        {items.map((item) => {
          const targetPath = item.path || item.menuUrl || '/';
          const isActive = Boolean(item.active) || isPathActive(targetPath);
          return (
            <li key={item.menuId} className={isActive ? 'is-active' : ''}>
              <Link
                to={targetPath}
                className={isActive ? 'active' : ''}
                aria-current={isActive ? 'page' : undefined}
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