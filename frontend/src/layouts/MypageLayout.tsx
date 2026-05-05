import { Outlet } from 'react-router-dom';
import Breadcrumb from '../components/common/Breadcrumb';
import { useMenu } from '../hooks/useMenu';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';

export default function MypageLayout() {
  const { currentTopMenu, currentSubMenus, submenuVisible } = useMenu();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {submenuVisible ? (
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
        ) : (
          <Outlet />
        )}
      </main>
      <Footer />
    </div>
  );
}
