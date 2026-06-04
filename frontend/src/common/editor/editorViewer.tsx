import type { EditorViewerProps } from './editorModel';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function toRenderableHtml(value: string): string {
  const trimmed = value.trim();
  const hasHtmlTag = /<\/?[a-z][\s\S]*>/i.test(trimmed);
  if (hasHtmlTag) {
    return trimmed;
  }

  return escapeHtml(trimmed).replace(/\n/g, '<br />');
}

export default function EditorViewer({ value, emptyText = '등록된 내용이 없습니다.' }: EditorViewerProps) {
  if (!value || !value.trim()) {
    return <p>{emptyText}</p>;
  }

  return <div className="prose editor-viewer-content max-w-none" dangerouslySetInnerHTML={{ __html: toRenderableHtml(value) }} />;
}
