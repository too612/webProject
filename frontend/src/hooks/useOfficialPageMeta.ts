import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

type PageMeta = {
  title: string;
  path: string;
  section: string;
  template: string;
};

type MetaOptions = {
  fallbackTitle: string;
  viewSuffix?: string;
  writeSuffix?: string;
};

function normalizePath(path: string): string {
  if (!path) {
    return '/';
  }

  const trimmed = path.trim();
  const withSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return withSlash.replace(/\/+$/, '') || '/';
}

function getBasePath(pathname: string): string {
  return normalizePath(pathname).replace(/\/(view|write)$/, '');
}

export function useOfficialPageMeta(
  getPages: () => Promise<PageMeta[]>,
  options: MetaOptions,
) {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState(options.fallbackTitle);

  const mode = useMemo<'list' | 'view' | 'write'>(() => {
    const normalizedPath = normalizePath(location.pathname);
    if (normalizedPath.endsWith('/view')) {
      return 'view';
    }
    if (normalizedPath.endsWith('/write')) {
      return 'write';
    }
    return 'list';
  }, [location.pathname]);

  useEffect(() => {
    let isMounted = true;

    const loadPageMeta = async () => {
      try {
        const pages = await getPages();
        const currentBasePath = getBasePath(location.pathname);
        const matched = pages.find((page) => normalizePath(page.path) === currentBasePath);

        if (!isMounted) {
          return;
        }

        if (!matched) {
          setPageTitle(options.fallbackTitle);
          return;
        }

        if (mode === 'view') {
          setPageTitle(`${matched.title}${options.viewSuffix ?? ' 상세'}`);
          return;
        }

        if (mode === 'write') {
          setPageTitle(`${matched.title}${options.writeSuffix ?? ' 등록'}`);
          return;
        }

        setPageTitle(matched.title);
      } catch (error) {
        if (isMounted) {
          setPageTitle(options.fallbackTitle);
        }
      }
    };

    loadPageMeta();

    return () => {
      isMounted = false;
    };
  }, [getPages, location.pathname, mode, options.fallbackTitle, options.viewSuffix, options.writeSuffix]);

  return { title: pageTitle };
}