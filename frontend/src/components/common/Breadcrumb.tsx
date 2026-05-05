import { Link } from 'react-router-dom';
import { useMenu } from '../../hooks/useMenu';

export default function Breadcrumb() {
  const { currentTopMenu, currentSubMenus, menuList: allTopMenus } = useMenu();

  const activeSubMenu = currentSubMenus.find((s) => s.active);

  return (
    <section className="breadcrumb">
      <div className="container">
        <nav className="breadcrumb-nav">
          <div
            className="breadcrumb-item"
            onClick={() => { window.location.href = '/'; }}
          >
            <span className="material-icons text-base">home</span>
          </div>

          {currentTopMenu && (
            <>
              <span className="breadcrumb-separator">&gt;</span>
              <div className="breadcrumb-item dropdown">
                <span>{currentTopMenu.menuName}</span>
                <span className="material-icons text-base">expand_more</span>
                <div className="dropdown-menu">
                  {allTopMenus.map((topMenu) => (
                    <Link
                      key={topMenu.menuId}
                      to={topMenu.path || topMenu.subMenus?.[0]?.path || '/'}
                      className="whitespace-nowrap"
                    >
                      {topMenu.menuName}
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeSubMenu && (
            <>
              <span className="breadcrumb-separator">&gt;</span>
              <div className="breadcrumb-item dropdown">
                <span>{activeSubMenu.menuName}</span>
                <span className="material-icons text-base">expand_more</span>
                <div className="dropdown-menu">
                  {currentSubMenus.map((sub) => (
                    <Link
                      key={sub.menuId}
                      to={sub.path || '/'}
                      className={`whitespace-nowrap${sub.active ? ' active' : ''}`}
                    >
                      {sub.menuName}
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </nav>
      </div>
    </section>
  );
}
