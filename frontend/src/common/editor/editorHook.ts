import { useMemo, useState } from 'react';
import { editorApi } from './editorApi';
import type { EditorValue } from './editorModel';

export function useEditor(initialValue: EditorValue = '') {
  const [value, setValue] = useState<EditorValue>(editorApi.normalize(initialValue));

  const plainText = useMemo(() => editorApi.toPlainText(value), [value]);

  return {
    value,
    setValue,
    plainText,
  };
}
