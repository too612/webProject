import { useState, type FocusEvent } from 'react';
import { Link } from 'react-router-dom';
import { useMenu } from '../common/menu/menuHook';

export default function Breadcrumb() {
  const { currentTopMenu, currentSubMenus, menuList: allTopMenus } = useMenu();
  const [isTopMenuOpen, setIsTopMenuOpen] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const activeSubMenu = currentSubMenus.find((s) => s.active);

  const closeTopMenu = () => setIsTopMenuOpen(false);
  const closeSubMenu = () => setIsSubMenuOpen(false);

  const handleDropdownBlur = (
    event: FocusEvent<HTMLDivElement>,
    closeDropdown: () => void
  ) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      closeDropdown();
    }
  };

  return (
    <section className="breadcrumb">
      <div className="container">
        <nav className="breadcrumb-nav">
          <Link className="breadcrumb-item" to="/" aria-label="홈으로 이동">
            <span className="material-icons text-base">home</span>
          </Link>

          {currentTopMenu && (
            <div
              className="breadcrumb-item dropdown"
              onBlur={(event) => handleDropdownBlur(event, closeTopMenu)}
            >
              <button
                type="button"
                className="inline-flex items-center gap-1"
                aria-haspopup="menu"
                aria-expanded={isTopMenuOpen}
                aria-controls="breadcrumb-top-menu"
                onClick={() => {
                  setIsTopMenuOpen((prev) => !prev);
                  setIsSubMenuOpen(false);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    closeTopMenu();
                  }
                }}
              >
                <span>{currentTopMenu.menuName}</span>
                <span className="material-icons text-base">expand_more</span>
              </button>
              <div id="breadcrumb-top-menu" className="dropdown-menu" role="menu" hidden={!isTopMenuOpen}>
                {allTopMenus.map((topMenu) => (
                  <Link
                    key={topMenu.menuId}
                    to={topMenu.path || topMenu.subMenus?.[0]?.path || '/'}
                    role="menuitem"
                    className="whitespace-nowrap"
                    onClick={closeTopMenu}
                  >
                    {topMenu.menuName}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {activeSubMenu && (
            <div
              className="breadcrumb-item dropdown"
              onBlur={(event) => handleDropdownBlur(event, closeSubMenu)}
            >
              <button
                type="button"
                className="inline-flex items-center gap-1"
                aria-haspopup="menu"
                aria-expanded={isSubMenuOpen}
                aria-controls="breadcrumb-sub-menu"
                onClick={() => {
                  setIsSubMenuOpen((prev) => !prev);
                  setIsTopMenuOpen(false);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    closeSubMenu();
                  }
                }}
              >
                <span>{activeSubMenu.menuName}</span>
                <span className="material-icons text-base">expand_more</span>
              </button>
              <div id="breadcrumb-sub-menu" className="dropdown-menu" role="menu" hidden={!isSubMenuOpen}>
                {currentSubMenus.map((sub) => (
                  <Link
                    key={sub.menuId}
                    to={sub.path || '/'}
                    role="menuitem"
                    className={`whitespace-nowrap${sub.active ? ' active' : ''}`}
                    onClick={closeSubMenu}
                  >
                    {sub.menuName}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>
      </div>
    </section>
  );
}
