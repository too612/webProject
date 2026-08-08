import { Suspense, useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { Toaster } from "./common/ui";
import { Loader2 } from "lucide-react";
import type { ExternalToast } from "sonner";

type ToastPosition = NonNullable<ExternalToast["position"]>;

function ResponsiveToaster() {
  const [position, setPosition] = useState<ToastPosition>(() =>
    window.innerWidth >= 768 ? "top-right" : "bottom-center",
  );

  useEffect(() => {
    const handler = () =>
      setPosition(window.innerWidth >= 768 ? "top-right" : "bottom-center");
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return <Toaster richColors position={position} />;
}

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm text-slate-400">잠시만 기다려주세요.</p>
        </div>
      }
    >
      <RouterProvider router={router} />
      <ResponsiveToaster />
    </Suspense>
  );
}
