import { useCallback, useState } from "react";

export function useSearchQuery<T>(
  initial: T,
  equals: (draft: T, applied: T) => boolean,
) {
  const [draft, setDraft] = useState(initial);
  const [applied, setApplied] = useState(initial);
  const [revision, setRevision] = useState(0);
  const apply = useCallback((query: T) => {
    setApplied(query);
    setRevision((value) => value + 1);
  }, []);
  const refresh = useCallback(() => setRevision((value) => value + 1), []);

  return { draft, setDraft, applied, revision, pending: !equals(draft, applied), apply, refresh };
}
