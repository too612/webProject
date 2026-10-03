import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Link,
  UNSAFE_LocationContext as WorkspaceLocationContext,
  useBlocker,
  useLocation,
  useNavigate,
  useNavigationType,
  useOutlet,
} from "react-router-dom";
import { useStore, type StoreApi } from "zustand";
import { Home, Loader2, LogIn, LogOut, Menu } from "lucide-react";
import { toast } from "sonner";
import { useMenu } from "../../common/menu/menuHook";
import { useAuthStore } from "../../common/auth/authStore";
import {
  createWorkspaceStore,
  type WorkspaceState,
} from "../../common/workspace/workspaceStore";
import type { MenuItem } from "../../common/menu/menu.types";
import {
  workspaceHref,
  workspaceMenuTrail,
} from "../../common/workspace/workspaceModel";
import { WorkspaceTabContext } from "../../common/workspace/workspaceHook";
import type { WorkspaceMenuPresentation } from "../../common/workspace/workspace.types";
import WorkspaceSidebar from "./WorkspaceSidebar";
import WorkspaceTabs from "./WorkspaceTabs";

type Props = Readonly<{
  basePath: string;
  name: string;
  menuPresentation?: WorkspaceMenuPresentation;
}>;

export default function WorkspaceLayout(props: Props) {
  const userId = useAuthStore((state) => state.user?.userId ?? "anonymous");
  return (
    <WorkspaceFrame
      key={props.basePath + ":" + userId}
      {...props}
      userId={userId}
    />
  );
}

function WorkspaceFrame({
  basePath,
  name,
  menuPresentation,
  userId,
}: Props & { userId: string }) {
  const [store] = useState(() => createWorkspaceStore(basePath, userId));
  const state = useStore(store);
  const { menuList, loading } = useMenu();
  const user = useAuthStore((auth) => auth.user);
  const isAuthenticated = useAuthStore((auth) => auth.isAuthenticated);
  const clearAuth = useAuthStore((auth) => auth.clearAuth);
  const location = useLocation();
  const navigationType = useNavigationType();
  const navigate = useNavigate();
  const outlet = useOutlet();
  const cache = useRef(new Map<string, ReactNode>());
  const initialLocation = useRef(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentHref =
    workspaceHref(location.pathname + location.search, basePath) ?? basePath;
  const trail = workspaceMenuTrail(menuList, currentHref);
  const breadcrumbTrail = trail[0]?.menuName === name ? trail.slice(1) : trail;
  const [currentMenu] = trail.slice(-1);
  const dirty = state.tabs.some((tab) => tab.dirty);
  const blocker = useBlocker(
    ({ nextLocation }) =>
      store.getState().tabs.some((tab) => tab.dirty) &&
      nextLocation.pathname !== basePath &&
      !nextLocation.pathname.startsWith(basePath + "/"),
  );

  useEffect(() => {
    if (blocker.state !== "blocked") return;
    if (
      window.confirm(
        "저장되지 않은 변경이 있습니다. 작업공간을 나가시겠습니까?",
      )
    )
      blocker.proceed();
    else blocker.reset();
  }, [blocker]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  useEffect(() => {
    if (!state.storageAvailable)
      toast.warning(
        "브라우저 저장 공간을 사용할 수 없어 설정과 탭을 복원할 수 없습니다.",
      );
  }, [state.storageAvailable]);

  useEffect(() => {
    if (initialLocation.current) {
      initialLocation.current = false;
      if (currentHref === basePath) {
        const restoredState = store.getState();
        if (navigationType === "POP" && restoredState.activeId) {
          navigate(restoredState.activeId, { replace: true });
          return;
        }
        if (navigationType !== "POP" && restoredState.tabs.length > 0) {
          restoredState.close(restoredState.tabs.map((tab) => tab.id));
        }
      }
    }
    if (currentHref === basePath) return;
    if (
      !store.getState().open({
        href: currentHref,
        title: currentMenu?.menuName ?? "작업",
        menuId: currentMenu?.menuId,
      })
    ) {
      toast.warning(
        "작업 탭은 최대 8개까지 열 수 있습니다. 기존 탭을 닫아주세요.",
      );
      navigate(store.getState().activeId ?? basePath, { replace: true });
      return;
    }
    cache.current.set(currentHref, outlet);
  }, [
    currentHref,
    currentMenu?.menuId,
    currentMenu?.menuName,
    outlet,
    store,
    navigate,
    basePath,
    navigationType,
  ]);

  const open = (href: string) => {
    const normalized = workspaceHref(href, basePath);
    if (!normalized) return;
    if (
      normalized !== basePath &&
      !state.tabs.some((tab) => tab.id === normalized) &&
      state.tabs.length >= 8
    ) {
      toast.warning(
        "작업 탭은 최대 8개까지 열 수 있습니다. 기존 탭을 닫아주세요.",
      );
      return;
    }
    setMobileOpen(false);
    navigate(normalized);
  };
  const close = (ids: string[]) => {
    if (
      state.tabs.some((tab) => ids.includes(tab.id) && tab.dirty) &&
      !window.confirm(
        "선택한 탭에 저장되지 않은 변경이 있습니다. 닫으시겠습니까?",
      )
    )
      return;
    const closingCurrent = ids.includes(currentHref);
    ids.forEach((id) => cache.current.delete(id));
    store.getState().close(ids);
    if (closingCurrent)
      navigate(store.getState().activeId ?? basePath, { replace: true });
  };
  const displayTabs = state.tabs.map((tab) => {
    const menuTrail = workspaceMenuTrail(menuList, tab.href);
    const [menu] = menuTrail.slice(-1);
    return { ...tab, title: menu?.menuName ?? tab.title };
  });

  return (
    <div className="workspace" data-workspace={basePath}>
      <header className="workspace-header">
        <button
          type="button"
          className="workspace-icon workspace-mobile-toggle"
          aria-label="메뉴 열기"
          title="메뉴 열기"
          aria-expanded={mobileOpen}
          aria-controls="workspace-navigation"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={20} />
        </button>
        <Link
          to={basePath}
          className="workspace-brand"
          aria-label={name + " 홈"}
        >
          <img src="/img/logo.png" alt="" />
          <strong>{name}</strong>
        </Link>
        <div className="workspace-header-actions">
          {isAuthenticated && (
            <span className="workspace-user">
              {user?.userName ?? user?.username ?? userId}
            </span>
          )}
          <Link
            to="/"
            className="workspace-icon"
            title="일반 사이트"
            aria-label="일반 사이트"
          >
            <Home size={18} />
          </Link>
          {isAuthenticated ? (
            <button
              type="button"
              className="workspace-icon"
              title="로그아웃"
              aria-label="로그아웃"
              onClick={() => {
                if (
                  dirty &&
                  !window.confirm(
                    "저장되지 않은 변경이 있습니다. 로그아웃하시겠습니까?",
                  )
                )
                  return;
                clearAuth();
              }}
            >
              <LogOut size={18} />
            </button>
          ) : (
            <Link
              to="/auth/login"
              state={{ from: location.pathname }}
              className="workspace-icon"
              title="로그인"
              aria-label="로그인"
            >
              <LogIn size={18} />
            </Link>
          )}
        </div>
      </header>
      <div className="workspace-body">
        <WorkspaceSidebar
          menus={menuList}
          currentGroupId={trail[0]?.menuId}
          currentMenuId={currentMenu?.menuId}
          menuPresentation={menuPresentation}
          preferences={state}
          mobileOpen={mobileOpen}
          loading={loading}
          onOpen={open}
          onFavorite={state.toggleFavorite}
          onToggleGroup={state.toggleGroup}
          onCollapse={state.toggleSidebar}
          onMobileClose={() => setMobileOpen(false)}
        />
        <div className="workspace-main">
          <WorkspaceTabs
            tabs={displayTabs}
            activeId={currentHref === basePath ? null : state.activeId}
            onSelect={open}
            onClose={close}
          />
          <div className="workspace-navigation-bar">
            <nav aria-label="현재 메뉴 경로">
              <Link to={basePath}>{name}</Link>
              {breadcrumbTrail.map((menu) => (
                <span key={menu.menuId}>
                  <span aria-hidden="true"> / </span>
                  {menu.menuName}
                </span>
              ))}
            </nav>
          </div>
          <main className="workspace-content">
            {currentHref === basePath && (
              <Suspense fallback={<Loading />}>
                <div className="workspace-home">{outlet}</div>
              </Suspense>
            )}
            {currentHref !== basePath &&
              !displayTabs.some((tab) => tab.id === currentHref) && <Loading />}
            {displayTabs.map((tab, index) => {
              const tabTrail = workspaceMenuTrail(menuList, tab.href);
              const [menu] = tabTrail.slice(-1);
              const active = tab.id === currentHref;
              return (
                <WorkspacePanel
                  key={tab.id}
                  store={store}
                  href={tab.href}
                  active={active}
                  index={index}
                  menu={menu ?? null}
                  navigationType={navigationType}
                >
                  <Suspense fallback={<Loading />}>
                    {active ? outlet : (cache.current.get(tab.id) ?? null)}
                  </Suspense>
                </WorkspacePanel>
              );
            })}
          </main>
        </div>
      </div>
    </div>
  );
}

function WorkspacePanel({
  store,
  href,
  active,
  index,
  menu,
  navigationType,
  children,
}: Readonly<{
  store: StoreApi<WorkspaceState>;
  href: string;
  active: boolean;
  index: number;
  menu: MenuItem | null;
  navigationType: ReturnType<typeof useNavigationType>;
  children: ReactNode;
}>) {
  const [actionsTarget, setActionsTarget] = useState<HTMLDivElement | null>(
    null,
  );
  const locationContext = useMemo(() => {
    const url = new URL(href, window.location.origin);
    return {
      location: {
        pathname: url.pathname,
        search: url.search,
        hash: "",
        state: null,
        key: href,
      },
      navigationType,
    };
  }, [href, navigationType]);
  const tabContext = useMemo(
    () => ({ store, tabId: href, active, menu, actionsTarget }),
    [store, href, active, menu, actionsTarget],
  );
  return (
    <section
      id={"workspace-panel-" + index}
      role="tabpanel"
      aria-labelledby={"workspace-tab-" + index}
      hidden={!active}
      className="workspace-tab-panel"
      tabIndex={0}
    >
      <div ref={setActionsTarget} className="workspace-page-actions" />
      <WorkspaceLocationContext.Provider value={locationContext}>
        <WorkspaceTabContext.Provider value={tabContext}>
          {children}
        </WorkspaceTabContext.Provider>
      </WorkspaceLocationContext.Provider>
    </section>
  );
}

function Loading() {
  return (
    <output className="workspace-loading">
      <Loader2 size={22} className="animate-spin" />
      불러오는 중...
    </output>
  );
}
