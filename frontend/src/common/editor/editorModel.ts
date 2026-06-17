/**
 * File Name   : editorModel
 * Description : 에디터 타입 정의
 */

export type EditorValue = string;

export type EditorMode = 'edit' | 'view';

export type EditorToolbarOption =
  | 'bold'
  | 'italic'
  | 'strike'
  | 'underline'
  | 'subscript'
  | 'superscript'
  | 'code'
  | 'codeBlock'
  | 'blockquote'
  | 'fontSize'
  | 'textColor'
  | 'highlight'
  | 'heading'
  | 'bulletList'
  | 'orderedList'
  | 'horizontalRule'
  | 'link'
  | 'image'
  | 'table'
  | 'alignLeft'
  | 'alignCenter'
  | 'alignRight'
  | 'alignJustify'
  | 'undo'
  | 'redo'
  | 'clearFormat';

export type EditorProps = {
  value: EditorValue;
  onChange: (nextValue: EditorValue) => void;
  placeholder?: string;
  disabled?: boolean;
  toolbar?: EditorToolbarOption[];
  /**
   * 이미지 파일 업로드 콜백 (선택)
   * - 제공하면 Base64 대신 서버 업로드 후 URL을 삽입합니다.
   * - 제공하지 않으면 기존 Base64 방식으로 동작 (하위 호환성 유지)
   */
  onImageUpload?: (file: File) => Promise<string>;
};

export type EditorViewerProps = {
  value: EditorValue;
  emptyText?: string;
};