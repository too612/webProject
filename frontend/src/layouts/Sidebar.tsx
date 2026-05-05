import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import type { MenuItem } from '../types/menu.types';

type SidebarProps = {
  items: MenuItem[];
};

export default function Sidebar({ items }: SidebarProps) {
  const location = useLocation();

  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        {items.map((item) => {
          const isActive = item.active || location.pathname === (item.path || item.menuUrl);
          return (
            <li key={item.menuId} className={isActive ? 'is-active' : ''}>
              <Link
                to={item.path || item.menuUrl || '/'}
                className={isActive ? 'active' : ''}
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