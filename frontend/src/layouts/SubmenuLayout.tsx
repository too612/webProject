import { Outlet } from 'react-router-dom';
import Breadcrumb from '../components/common/Breadcrumb';
import { useMenu } from '../hooks/useMenu';
import Sidebar from './Sidebar';

export default function SubmenuLayout() {
  const { currentTopMenu, currentSubMenus } = useMenu();

  return (
    <>
      {currentTopMenu && (
        <section className="hero">
          <h1>{currentTopMenu.menuName}</h1>
          <div className="hero-illustration" />
        </section>
      )}
      <Breadcrumb />
      <main className="main-content">
        <Sidebar items={currentSubMenus} />
        <div className="content-area min-w-0">
          <Outlet />
        </div>
      </main>
    </>
  );
}