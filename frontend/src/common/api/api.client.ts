import axios, { AxiosError, type AxiosInstance } from 'axios';
import { useAuthStore } from '../auth/authStore';

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    authRevision?: number;
  }
}

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api';

const CSRF_COOKIE_NAME = 'XSRF-TOKEN';
const CSRF_HEADER_NAME = 'X-XSRF-TOKEN';
const CSRF_SAFE_METHODS = new Set(['get', 'head', 'options', 'trace']);

const client: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let pendingCsrfToken: Promise<string | null> | null = null;

function readCookie(name: string): string | null {
  const matched = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));
  return matched ? decodeURIComponent(matched.slice(name.length + 1)) : null;
}

/**
 * CSRF 토큰을 확보한다.
 * 서버가 내려준 XSRF-TOKEN 쿠키를 우선 사용하고, 쿠키가 없으면(로그인 첫 요청 등)
 * /auth/csrf 로 발급받는다. 동시 요청은 하나의 발급 요청을 공유한다.
 */
async function ensureCsrfToken(): Promise<string | null> {
  const cookieToken = readCookie(CSRF_COOKIE_NAME);
  if (cookieToken) {
    return cookieToken;
  }

  if (!pendingCsrfToken) {
    const request = axios
      .get<{ data?: { token?: string } | null }>(`${baseURL}/auth/csrf`, {
        withCredentials: true,
      })
      .then((response) => response.data?.data?.token ?? readCookie(CSRF_COOKIE_NAME))
      .catch(() => readCookie(CSRF_COOKIE_NAME));

    pendingCsrfToken = request.finally(() => {
      pendingCsrfToken = null;
    });
  }

  return pendingCsrfToken;
}

client.interceptors.request.use(
  async (config) => {
    config.authRevision = useAuthStore.getState().authRevision;
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const method = (config.method ?? 'get').toLowerCase();
    if (!CSRF_SAFE_METHODS.has(method)) {
      const csrfToken = await ensureCsrfToken();
      if (csrfToken) {
        config.headers[CSRF_HEADER_NAME] = csrfToken;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => {
    if (response.data?.statusCode === 401 && response.config.url !== '/auth/login'
      && response.config.authRevision !== undefined) {
      useAuthStore.getState().clearAuth(response.config.authRevision);
    }
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401 && error.config?.url !== '/auth/login'
      && error.config?.authRevision !== undefined) {
      useAuthStore.getState().clearAuth(error.config.authRevision);
    }
    return Promise.reject(error);
  }
);

/**
 * fetch 기반 호출(파일 삭제·배너 저장 등)에서도 CSRF 검증을 통과할 수 있도록 헤더를 구성한다.
 */
export async function withCsrfHeaders(
  headers: Record<string, string> = {}
): Promise<Record<string, string>> {
  const csrfToken = await ensureCsrfToken();
  return csrfToken ? { ...headers, [CSRF_HEADER_NAME]: csrfToken } : headers;
}

export default client;
