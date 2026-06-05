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
  const normalized = value.replace(/\r\n?/g, '\n');
  const hasHtmlTag = /<\/?[a-z][\s\S]*>/i.test(normalized.trim());
  if (hasHtmlTag) {
    const hasLineBreakTag = /<(br\s*\/?)>/i.test(normalized);
    const hasBlockTag = /<\/?(p|div|section|article|blockquote|li|ul|ol|h[1-6]|pre|table|tr|td|th|hr)\b/i.test(normalized);

    if (!hasLineBreakTag && !hasBlockTag && normalized.includes('\n')) {
      return normalized.replace(/\n/g, '<br />');
    }

    return normalized;
  }

  return escapeHtml(normalized).replace(/\n/g, '<br />');
}

export default function EditorViewer({ value, emptyText = '등록된 내용이 없습니다.' }: EditorViewerProps) {
  if (!value || !value.trim()) {
    return <p>{emptyText}</p>;
  }

  return <div className="prose editor-viewer-content max-w-none" dangerouslySetInnerHTML={{ __html: toRenderableHtml(value) }} />;
}
