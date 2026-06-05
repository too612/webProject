import type { EditorValue } from './editorModel';

export const editorApi = {
  normalize(value: EditorValue): EditorValue {
    return value ?? '';
  },

  toPlainText(value: EditorValue): string {
    return (value ?? '')
      .replace(/\r\n?/g, '\n')
      .replace(/<br\s*\/?\s*>/gi, '\n')
      .replace(/<\/p>\s*<p>/gi, '\n')
      .replace(/<[^>]*>/g, '')
      .trim();
  },
};
