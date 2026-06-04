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
};

export type EditorViewerProps = {
  value: EditorValue;
  emptyText?: string;
};
