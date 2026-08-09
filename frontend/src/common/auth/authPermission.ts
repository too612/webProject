import { useMemo } from "react";
import { useAuthStore } from "./authStore";

export function useAuthPermission(programId: string) {
  const { user } = useAuthStore();

  return useMemo(() => {
    const permission = user?.permissions?.[programId] ?? null;

    const hasAction = (actionCode: string) => {
      switch (actionCode) {
        case "edit":
          return Boolean(permission?.canUpdate || permission?.canWrite);
        case "save":
          return Boolean(permission?.canUpdate || permission?.canWrite);
        case "cancel":
          return true;
        case "delete":
          return Boolean(permission?.canDelete);
        default:
          return false;
      }
    };

    return {
      canRead: Boolean(permission?.canRead),
      canWrite: Boolean(permission?.canWrite),
      canUpdate: Boolean(permission?.canUpdate),
      canDelete: Boolean(permission?.canDelete),
      isOpen: Boolean(permission?.isOpen),
      hasAction,
    };
  }, [programId, user?.permissions]);
}
