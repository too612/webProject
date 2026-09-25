import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface PageShellProps {
  readonly children: ReactNode;
  readonly className?: string;
}

export function PageShell({ children, className }: PageShellProps) {
  return <section className={cn("space-y-5", className)}>{children}</section>;
}
