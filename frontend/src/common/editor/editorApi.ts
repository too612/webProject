import type { EditorValue } from './editorModel';

export const editorApi = {
  normalize(value: EditorValue): EditorValue {
    return value ?? '';
  },

  toPlainText(value: EditorValue): string {
    return (value ?? '').replace(/<[^>]*>/g, '').trim();
  },
};
