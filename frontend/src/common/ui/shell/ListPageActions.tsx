import type { ReactNode } from "react";
import { UserPlus } from "lucide-react";
import { ActionButton } from "../action-button";
import { Button } from "../button";

export interface ListPageActionsProps {
  readonly searchFormId: string;
  readonly searching?: boolean;
  readonly onCreate?: () => void;
  readonly createLabel?: string;
  readonly searchAllowed?: boolean;
  readonly createAllowed?: boolean;
  readonly createDisabled?: boolean;
  readonly children?: ReactNode;
}

export function ListPageActions({
  searchFormId, searching = false, onCreate, createLabel = "신규 등록",
  searchAllowed = true, createAllowed = true, createDisabled = false, children,
}: ListPageActionsProps) {
  return (
    <div data-ui="list-actions" className="flex flex-wrap items-center gap-2">
      {searchAllowed && <ActionButton action="search" label="조회" type="submit" form={searchFormId} loading={searching} />}
      {onCreate && createAllowed && (
        <Button type="button" onClick={onCreate} disabled={createDisabled}>
          <UserPlus aria-hidden="true" className="mr-2 h-4 w-4" />{createLabel}
        </Button>
      )}
      {children}
    </div>
  );
}
