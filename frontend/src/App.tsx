import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
          불러오는 중...
        </div>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  );
}