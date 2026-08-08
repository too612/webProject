import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: "red" | "blue" | "gray";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "확인",
  cancelText = "취소",
  confirmColor = "red",
  onConfirm,
  onCancel,
}: Readonly<ConfirmModalProps>) {
  const variantMap = {
    red: "destructive",
    blue: "default",
    gray: "secondary",
  } as const;

  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => !open && onCancel()}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
            "bg-background rounded-lg shadow-xl p-6 w-full max-w-sm mx-4 focus:outline-none",
          )}
        >
          <DialogPrimitive.Title className="text-lg font-bold text-foreground mb-2">
            {title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="text-sm text-muted-foreground mb-5">
            {message}
          </DialogPrimitive.Description>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={onCancel}>
              {cancelText}
            </Button>
            <Button
              variant={variantMap[confirmColor]}
              size="sm"
              onClick={onConfirm}
            >
              {confirmText}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
