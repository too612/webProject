import { useEffect, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import { mergeAttributes, ResizableNodeView } from '@tiptap/core';
import { NodeSelection } from '@tiptap/pm/state';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { TextStyle } from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Highlight from '@tiptap/extension-highlight';
import Color from '@tiptap/extension-color';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import type { EditorProps } from './editorModel';

const IMAGE_ALIGN_OPTIONS = [
  { value: 'left', label: '왼쪽' },
  { value: 'center', label: '가운데' },
  { value: 'right', label: '오른쪽' },
] as const;

const IMAGE_SIZE_OPTIONS = [
  { value: 240, label: '240px' },
  { value: 360, label: '360px' },
  { value: 480, label: '480px' },
  { value: 640, label: '640px' },
] as const;

type ImageAlign = 'left' | 'center' | 'right';

type EditorImageAttrs = {
  src?: string;
  alt?: string | null;
  title?: string | null;
  align?: ImageAlign;
  width?: number | null;
  height?: number | null;
};

const hasHtmlTag = (value: string) => /<\/?[a-z][\s\S]*>/i.test(value.trim());

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const normalizeEditorContent = (value: string) => {
  const normalized = (value || '').replace(/\r\n?/g, '\n');
  if (!normalized) {
    return '';
  }

  if (hasHtmlTag(normalized)) {
    return normalized;
  }

  return `<p>${escapeHtml(normalized).replace(/\n/g, '<br />')}</p>`;
};

const getImagePosFromSelection = (editorInstance: NonNullable<ReturnType<typeof useEditor>>) => {
  const { selection, doc } = editorInstance.state;
  const { from, to } = selection;

  const selectedNode = (selection as NodeSelection).node;
  if (selectedNode?.type?.name === 'image') {
    return from;
  }

  const nodeAtFrom = doc.nodeAt(from);
  if (nodeAtFrom?.type.name === 'image') {
    return from;
  }

  const nodeBeforeFrom = doc.nodeAt(from - 1);
  if (nodeBeforeFrom?.type.name === 'image') {
    return from - 1;
  }

  let foundPos: number | null = null;
  doc.nodesBetween(from, to, (node, pos) => {
    if (node.type.name === 'image') {
      foundPos = pos;
      return false;
    }
    return true;
  });

  return foundPos;
};

const resolveImageAlign = (align?: string): ImageAlign => {
  if (align === 'left' || align === 'right') {
    return align;
  }
  return 'center';
};

const IMAGE_ALIGN_CLASS_PREFIX = 'editor-image-align-';

const resolveImageAlignClass = (align: ImageAlign) => `${IMAGE_ALIGN_CLASS_PREFIX}${align}`;

const normalizeImageClassName = (className: string | undefined, align: ImageAlign) => {
  const classTokens = new Set((className || '').split(/\s+/).filter(Boolean));
  classTokens.forEach((token) => {
    if (token.startsWith(IMAGE_ALIGN_CLASS_PREFIX)) {
      classTokens.delete(token);
    }
  });
  classTokens.add(resolveImageAlignClass(align));
  return Array.from(classTokens).join(' ');
};

const resolveAlignFromClassName = (className?: string | null): ImageAlign | null => {
  if (!className) {
    return null;
  }

  if (className.includes(resolveImageAlignClass('left'))) {
    return 'left';
  }
  if (className.includes(resolveImageAlignClass('right'))) {
    return 'right';
  }
  if (className.includes(resolveImageAlignClass('center'))) {
    return 'center';
  }

  return null;
};

const resolveImageAlignFromElement = (element: HTMLImageElement): ImageAlign => {
  const dataAlign = element.dataset.imageAlign;
  if (dataAlign === 'left' || dataAlign === 'center' || dataAlign === 'right') {
    return dataAlign;
  }

  const classAlign = resolveAlignFromClassName(element.getAttribute('class'));
  if (classAlign) {
    return classAlign;
  }

  return 'center';
};

const resolveImageWidthFromElement = (element: HTMLImageElement): number | null => {
  const dataWidth = element.dataset.imageWidth;
  if (dataWidth) {
    const parsedDataWidth = Number(dataWidth);
    if (Number.isFinite(parsedDataWidth)) {
      return parsedDataWidth;
    }
  }

  const attrWidth = element.getAttribute('width');
  if (attrWidth) {
    const parsedAttrWidth = Number(attrWidth);
    if (Number.isFinite(parsedAttrWidth)) {
      return parsedAttrWidth;
    }
  }

  return null;
};

const buildImageStyle = ({ align, width, height }: { align: ImageAlign; width?: number | null; height?: number | null }) => {
  const styleParts = [
    width ? `width: ${width}px` : 'width: auto',
    height ? `height: ${height}px` : 'height: auto',
    'display: block',
    align === 'center'
      ? 'margin-left: auto; margin-right: auto'
      : align === 'right'
        ? 'margin-left: auto; margin-right: 0'
        : 'margin-left: 0; margin-right: auto',
    'max-width: 100%',
  ];

  return styleParts.join('; ');
};

const applyImageContainerAlign = (element: HTMLImageElement, align: ImageAlign) => {
  const wrapper =
    (element.closest('[data-resize-container][data-node="image"]') as HTMLElement | null) ||
    (element.closest('[data-node-view-wrapper]') as HTMLElement | null) ||
    (element.closest('[data-resize-wrapper]') as HTMLElement | null) ||
    element.parentElement;

  if (!wrapper) {
    return;
  }

  wrapper.style.setProperty('display', 'block', 'important');
  wrapper.style.setProperty('width', 'fit-content', 'important');
  wrapper.style.setProperty('max-width', '100%', 'important');
  wrapper.style.setProperty('text-align', 'initial', 'important');
  wrapper.style.setProperty('margin-left', align === 'right' || align === 'center' ? 'auto' : '0', 'important');
  wrapper.style.setProperty('margin-right', align === 'left' || align === 'center' ? 'auto' : '0', 'important');
};

const applyImageDomAttributes = (element: HTMLImageElement, attrs: EditorImageAttrs) => {
  const align = resolveImageAlign(attrs.align);

  if (attrs.src) {
    element.src = attrs.src;
  }
  if (attrs.alt) {
    element.alt = attrs.alt;
  } else {
    element.removeAttribute('alt');
  }
  if (attrs.title) {
    element.title = attrs.title;
  } else {
    element.removeAttribute('title');
  }

  element.setAttribute('draggable', 'true');
  element.dataset.imageAlign = align;
  const classTokens = new Set((element.getAttribute('class') || '').split(/\s+/).filter(Boolean));
  classTokens.forEach((className) => {
    if (className.startsWith(IMAGE_ALIGN_CLASS_PREFIX)) {
      classTokens.delete(className);
    }
  });
  classTokens.add(resolveImageAlignClass(align));
  element.setAttribute('class', Array.from(classTokens).join(' '));

  if (attrs.width) {
    element.setAttribute('width', String(attrs.width));
    element.dataset.imageWidth = String(attrs.width);
  } else {
    element.removeAttribute('width');
    delete element.dataset.imageWidth;
  }

  if (attrs.height) {
    element.setAttribute('height', String(attrs.height));
  } else {
    element.removeAttribute('height');
  }

  element.setAttribute('style', buildImageStyle({ align, width: attrs.width, height: attrs.height }));
  applyImageContainerAlign(element, align);
};

const EditorImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: 'center',
        parseHTML: (element) => {
          const htmlElement = element as HTMLElement;
          const classBasedAlign = resolveAlignFromClassName(htmlElement.getAttribute('class'));

          return (
            htmlElement.dataset.imageAlign ||
            classBasedAlign ||
            (htmlElement.style.marginLeft === 'auto' && htmlElement.style.marginRight === 'auto'
              ? 'center'
              : htmlElement.style.marginLeft === 'auto'
                ? 'right'
                : 'left')
          );
        },
        renderHTML: (attributes) => {
          const align = resolveImageAlign(attributes.align as string | undefined);
          return {
            'data-image-align': align,
            class: resolveImageAlignClass(align),
          };
        },
      },
      width: {
        default: null,
        parseHTML: (element) => {
          const htmlElement = element as HTMLElement;
          const attrWidth = htmlElement.getAttribute('width');
          if (attrWidth) {
            const parsedAttrWidth = Number(attrWidth);
            if (Number.isFinite(parsedAttrWidth)) {
              return parsedAttrWidth;
            }
          }

          const dataWidth = htmlElement.dataset.imageWidth;
          if (dataWidth) {
            return Number(dataWidth);
          }

          const parsedWidth = Number.parseInt(htmlElement.style.width.replace('px', ''), 10);
          return Number.isFinite(parsedWidth) ? parsedWidth : null;
        },
        renderHTML: (attributes) => {
          const width = attributes.width as number | null | undefined;
          return width ? { width, 'data-image-width': String(width) } : {};
        },
      },
      height: {
        default: null,
        parseHTML: (element) => {
          const htmlElement = element as HTMLElement;
          const attrHeight = htmlElement.getAttribute('height');
          if (attrHeight) {
            const parsedAttrHeight = Number(attrHeight);
            if (Number.isFinite(parsedAttrHeight)) {
              return parsedAttrHeight;
            }
          }

          const styleHeight = htmlElement.style.height;
          const parsedStyleHeight = Number.parseInt(styleHeight.replace('px', ''), 10);
          return Number.isFinite(parsedStyleHeight) ? parsedStyleHeight : null;
        },
        renderHTML: (attributes) => {
          const height = attributes.height as number | null | undefined;
          return height ? { height } : {};
        },
      },
    };
  },
  renderHTML({ HTMLAttributes }) {
    const attributes = HTMLAttributes as EditorImageAttrs;
    const align = resolveImageAlign(attributes.align);
    const normalizedClassName = normalizeImageClassName(
      (HTMLAttributes as { class?: string }).class,
      align
    );
    const {
      style: _style,
      class: _className,
      ...sanitizedAttributes
    } = HTMLAttributes as Record<string, unknown>;

    return [
      'img',
      mergeAttributes({ draggable: 'true' }, sanitizedAttributes, {
        class: normalizedClassName,
        style: buildImageStyle({ align, width: attributes.width, height: attributes.height }),
      }),
    ];
  },
  addNodeView() {
    if (!this.options.resize || !this.options.resize.enabled || typeof document === 'undefined') {
      return null;
    }

    const { directions, minWidth, minHeight, alwaysPreserveAspectRatio } = this.options.resize;

    return ({ node, getPos, editor }) => {
      const element = document.createElement('img');
      let currentAlign = resolveImageAlign((node.attrs as EditorImageAttrs).align);

      applyImageDomAttributes(element, node.attrs as EditorImageAttrs);

      const nodeView = new ResizableNodeView({
        element,
        editor,
        node,
        getPos,
        onResize: (width, height) => {
          element.setAttribute('style', buildImageStyle({ align: currentAlign, width, height }));
        },
        onCommit: (width, height) => {
          const pos = getPos();
          if (pos === undefined) {
            return;
          }

          this.editor
            .chain()
            .setNodeSelection(pos)
            .updateAttributes(this.name, {
              width,
              height,
            })
            .run();
        },
        onUpdate: (updatedNode) => {
          if (updatedNode.type !== node.type) {
            return false;
          }

          currentAlign = resolveImageAlign(updatedNode.attrs.align);
          applyImageDomAttributes(element, updatedNode.attrs as EditorImageAttrs);
          requestAnimationFrame(() => {
            applyImageContainerAlign(element, currentAlign);
          });
          return true;
        },
        options: {
          directions,
          min: {
            width: minWidth,
            height: minHeight,
          },
          preserveAspectRatio: alwaysPreserveAspectRatio === true,
        },
      });

      const dom = nodeView.dom as HTMLElement;
      dom.style.visibility = 'hidden';
      dom.style.pointerEvents = 'none';

      const revealAndAlign = () => {
        dom.style.visibility = '';
        dom.style.pointerEvents = '';
        applyImageContainerAlign(element, currentAlign);
      };

      if (element.complete) {
        revealAndAlign();
      } else {
        element.addEventListener('load', revealAndAlign, { once: true });
        element.addEventListener('error', revealAndAlign, { once: true });
      }

      requestAnimationFrame(() => {
        applyImageContainerAlign(element, currentAlign);
      });

      return nodeView;
    };
  },
});

export default function Editor({
  value,
  onChange,
  placeholder = '내용을 입력해 주세요.',
  disabled = false,
  toolbar,
  onImageUpload, // ★ 추가: 이미지 업로드 콜백
}: EditorProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const lastEmittedHtmlRef = useRef<string>('');
  const selectedImagePosRef = useRef<number | null>(null);
  const lastSelectedImageElementRef = useRef<HTMLImageElement | null>(null);
  const [hasTrackedImageSelection, setHasTrackedImageSelection] = useState(false);

  const enabledTools = useMemo(
    () =>
      new Set(
        toolbar ?? [
          'heading',
          'bold',
          'italic',
          'strike',
          'underline',
          'subscript',
          'superscript',
          'fontSize',
          'textColor',
          'highlight',
          'alignLeft',
          'alignCenter',
          'alignRight',
          'alignJustify',
          'bulletList',
          'orderedList',
          'blockquote',
          'code',
          'codeBlock',
          'horizontalRule',
          'link',
          'image',
          'table',
          'clearFormat',
          'undo',
          'redo',
        ]
      ),
    [toolbar]
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight,
      Subscript,
      Superscript,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
      }),
      EditorImage.configure({
        allowBase64: true,
        resize: {
          enabled: true,
          directions: ['top-left', 'top', 'top-right', 'left', 'right', 'bottom-left', 'bottom', 'bottom-right'],
          minWidth: 120,
          minHeight: 120,
          alwaysPreserveAspectRatio: true,
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: normalizeEditorContent(value),
    editable: !disabled,
    onUpdate: ({ editor: currentEditor }) => {
      const html = currentEditor.getHTML();
      lastEmittedHtmlRef.current = html;
      onChange(html);
    },
    onSelectionUpdate: ({ editor: currentEditor }) => {
      const imagePos = getImagePosFromSelection(currentEditor);
      if (typeof imagePos === 'number') {
        selectedImagePosRef.current = imagePos;
        setHasTrackedImageSelection(true);
        return;
      }

      setHasTrackedImageSelection(false);
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const incoming = normalizeEditorContent(value || '');
    if (incoming === lastEmittedHtmlRef.current) {
      return;
    }

    if (editor.getHTML() !== incoming) {
      editor.commands.setContent(incoming, { emitUpdate: false });
      lastEmittedHtmlRef.current = incoming;

      requestAnimationFrame(() => {
        const root = editor.view.dom as HTMLElement;
        root.querySelectorAll('img').forEach((imageNode) => {
          const imageElement = imageNode as HTMLImageElement;
          applyImageContainerAlign(imageElement, resolveImageAlignFromElement(imageElement));
        });
      });
    }
  }, [editor, value]);

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [editor, disabled]);

  const resolveImagePosFromDom = (element: HTMLElement): number | null => {
    try {
      const pos = editor.view.posAtDOM(element, 0);
      const doc = editor.state.doc;
      for (const p of [pos, pos - 1, pos + 1]) {
        if (p >= 0 && p <= doc.content.size && doc.nodeAt(p)?.type.name === 'image') {
          return p;
        }
      }
    } catch {
      // posAtDOM throws if element is not tracked by ProseMirror
    }
    return null;
  };

  // 이미지 위치를 신뢰할 수 있는 순서대로 찾는다
  const findImagePosForUpdate = (): number | null => {
    const doc = editor.state.doc;

    // 1. 저장된 ref (selection/click 이벤트에서 설정)
    const refPos = selectedImagePosRef.current;
    if (typeof refPos === 'number') {
      for (const p of [refPos, refPos - 1, refPos + 1]) {
        if (p >= 0 && p <= doc.content.size && doc.nodeAt(p)?.type.name === 'image') {
          return p;
        }
      }
    }

    // 2. ProseMirror 현재 selection
    const selPos = getImagePosFromSelection(editor);
    if (typeof selPos === 'number') return selPos;

    // 3. 마지막으로 클릭한 DOM 요소에서 역추적
    const lastEl = lastSelectedImageElementRef.current;
    if (lastEl && editor.view.dom.contains(lastEl)) {
      const container =
        (lastEl.closest('[data-resize-container][data-node="image"]') as HTMLElement | null) ??
        lastEl;
      const domPos = resolveImagePosFromDom(container);
      if (domPos !== null) return domPos;
    }

    // 4. 문서에 이미지가 1개뿐이면 무조건 그것
    let found: number | null = null;
    let count = 0;
    doc.descendants((node, pos) => {
      if (node.type.name === 'image') {
        found = pos;
        count += 1;
      }
      return true;
    });
    return count === 1 ? found : null;
  };

  useEffect(() => {
    if (!editor) {
      return;
    }

    const root = editor.view.dom;

    const markDragging = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (!target || target.tagName !== 'IMG') {
        return;
      }
      target.setAttribute('data-dragging-image', 'true');
    };

    const clearDragging = () => {
      root.querySelectorAll('img[data-dragging-image="true"]').forEach((node) => {
        node.removeAttribute('data-dragging-image');
      });
    };

    root.addEventListener('dragstart', markDragging, true);
    root.addEventListener('dragend', clearDragging, true);
    root.addEventListener('drop', clearDragging, true);

    const trackImageSelection = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (!target) {
        return;
      }

      const imageElement =
        target.tagName === 'IMG'
          ? (target as HTMLImageElement)
          : (target.closest('[data-resize-container][data-node="image"]')?.querySelector('img') as HTMLImageElement | null);

      if (!imageElement) {
        return;
      }

      lastSelectedImageElementRef.current = imageElement;
      const pos = resolveImagePosFromDom(imageElement);
      if (typeof pos === 'number') {
        selectedImagePosRef.current = pos;
        setHasTrackedImageSelection(true);
      }
    };

    root.addEventListener('pointerdown', trackImageSelection, true);
    root.addEventListener('click', trackImageSelection, true);

    return () => {
      root.removeEventListener('dragstart', markDragging, true);
      root.removeEventListener('dragend', clearDragging, true);
      root.removeEventListener('drop', clearDragging, true);
      root.removeEventListener('pointerdown', trackImageSelection, true);
      root.removeEventListener('click', trackImageSelection, true);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  const setFontSize = (fontSize: string) => {
    editor.chain().focus().setMark('textStyle', { fontSize }).run();
  };

  const setTextColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  const toggleLink = () => {
    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const nextUrl = window.prompt('링크 URL을 입력해 주세요.', previousUrl || 'https://');

    if (nextUrl === null) {
      return;
    }

    const trimmed = nextUrl.trim();
    if (!trimmed) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: trimmed }).run();
  };

  const addImageByUrl = () => {
    const src = window.prompt('이미지 URL을 입력해 주세요.', 'https://');
    if (!src) {
      return;
    }
    editor
      .chain()
      .focus()
      .setImage({ src: src.trim(), width: 640 })
      .updateAttributes('image', { align: 'center' })
      .run();
  };

  // ★ 수정된 addImageByFile 함수 (onImageUpload 사용)
  const addImageByFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // ★ onImageUpload가 있으면 서버 업로드 실행
    if (onImageUpload) {
      try {
        const imageUrl = await onImageUpload(file);
        editor
          .chain()
          .focus()
          .setImage({ src: imageUrl, alt: file.name, width: 640 })
          .updateAttributes('image', { align: 'center' })
          .run();
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        alert('이미지 업로드 중 오류가 발생했습니다.');
      }
      event.target.value = '';
      return;
    }

    // ★ Fallback: 기존 Base64 방식
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        editor
          .chain()
          .focus()
          .setImage({ src: result, alt: file.name, width: 640 })
          .updateAttributes('image', { align: 'center' })
          .run();
      }
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const clearFormatting = () => {
    editor.chain().focus().clearNodes().unsetAllMarks().run();
  };

  const setImageAlign = (align: 'left' | 'center' | 'right') => {
    const pos = findImagePosForUpdate();
    if (pos === null) return;
    editor.chain().setNodeSelection(pos).updateAttributes('image', { align }).run();
    selectedImagePosRef.current = pos;
  };

  const setImageWidth = (width: number) => {
    const pos = findImagePosForUpdate();
    if (pos === null) return;
    editor.chain().setNodeSelection(pos).updateAttributes('image', { width }).run();
    selectedImagePosRef.current = pos;
  };

  const selectedImagePos = findImagePosForUpdate();
  const selectedImageNode =
    typeof selectedImagePos === 'number' ? editor.state.doc.nodeAt(selectedImagePos) : null;
  const selectedImageAttributes =
    selectedImageNode?.type.name === 'image' ? (selectedImageNode.attrs as EditorImageAttrs) : null;
  const selectedImageElement = lastSelectedImageElementRef.current;
  const selectedImageElementInEditor =
    selectedImageElement && editor.view.dom.contains(selectedImageElement) ? selectedImageElement : null;
  const selectedImageAlign = selectedImageElementInEditor
    ? resolveImageAlignFromElement(selectedImageElementInEditor)
    : resolveImageAlign(selectedImageAttributes?.align);
  const selectedImageWidth = selectedImageElementInEditor
    ? resolveImageWidthFromElement(selectedImageElementInEditor) ?? (selectedImageAttributes?.width || 640)
    : selectedImageAttributes?.width || 640;
  const hasSelectedImage =
    Boolean(selectedImageAttributes) ||
    hasTrackedImageSelection ||
    Boolean(lastSelectedImageElementRef.current && editor.view.dom.contains(lastSelectedImageElementRef.current));

  const toolbarButtonClass = (isActive = false) =>
    `h-8 w-8 inline-flex items-center justify-center border border-slate-300 transition-colors ${isActive ? 'bg-slate-200 text-slate-900' : 'bg-white text-slate-700 hover:bg-slate-100'}`;

  const handleInsertAction = (action: string) => {
    switch (action) {
      case 'link':
        toggleLink();
        break;
      case 'imageUrl':
        addImageByUrl();
        break;
      case 'imageFile':
        fileInputRef.current?.click();
        break;
      case 'table':
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
        break;
      case 'tableDelete':
        editor.chain().focus().deleteTable().run();
        break;
      case 'horizontalRule':
        editor.chain().focus().setHorizontalRule().run();
        break;
      default:
        break;
    }
  };

  const IconButton = ({
    title,
    active = false,
    children,
    onClick,
    disabled: buttonDisabled = disabled,
  }: {
    title: string;
    active?: boolean;
    children: ReactNode;
    onClick: () => void;
    disabled?: boolean;
  }) => (
    <button
      type="button"
      className={toolbarButtonClass(active)}
      onClick={onClick}
      disabled={buttonDisabled}
      title={title}
    >
      {children}
    </button>
  );

  const ToolbarDivider = () => <span className="mx-1 h-5 w-px bg-slate-200" aria-hidden="true" />;

  return (
    <div className="overflow-hidden rounded-md border border-slate-300 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-2 py-2">
        <div className="flex flex-wrap items-center gap-1 py-1">
        {enabledTools.has('heading') && (
          <select
            className="h-8 min-w-[110px] rounded-sm border border-slate-300 bg-white px-2 text-xs text-slate-700"
            value={
              editor.isActive('heading', { level: 1 })
                ? 'h1'
                : editor.isActive('heading', { level: 2 })
                  ? 'h2'
                  : editor.isActive('heading', { level: 3 })
                    ? 'h3'
                    : 'p'
            }
            onChange={(event) => {
              const type = event.target.value;
              if (type === 'p') {
                editor.chain().focus().setParagraph().run();
                return;
              }
              const level = Number(type.replace('h', '')) as 1 | 2 | 3;
              editor.chain().focus().toggleHeading({ level }).run();
            }}
            disabled={disabled}
            title="문단 스타일"
          >
            <option value="p">본문</option>
            <option value="h1">제목 1</option>
            <option value="h2">제목 2</option>
            <option value="h3">제목 3</option>
          </select>
        )}

        {enabledTools.has('fontSize') && (
          <select
            className="h-8 min-w-[92px] rounded-sm border border-slate-300 bg-white px-2 text-xs text-slate-700"
            value={editor.getAttributes('textStyle').fontSize || '16px'}
            onChange={(event) => setFontSize(event.target.value)}
            disabled={disabled}
            title="글자 크기"
          >
            <option value="14px">14px</option>
            <option value="16px">16px</option>
            <option value="18px">18px</option>
            <option value="24px">24px</option>
          </select>
        )}

        <ToolbarDivider />

        {enabledTools.has('bold') && (
          <IconButton title="굵게" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
            <span className="material-icons text-base">format_bold</span>
          </IconButton>
        )}
        {enabledTools.has('italic') && (
          <IconButton title="기울임" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
            <span className="material-icons text-base">format_italic</span>
          </IconButton>
        )}
        {enabledTools.has('underline') && (
          <IconButton title="밑줄" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
            <span className="material-icons text-base">format_underlined</span>
          </IconButton>
        )}
        {enabledTools.has('strike') && (
          <IconButton title="취소선" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
            <span className="material-icons text-base">format_strikethrough</span>
          </IconButton>
        )}
        {enabledTools.has('subscript') && (
          <IconButton title="아래첨자" active={editor.isActive('subscript')} onClick={() => editor.chain().focus().toggleSubscript().run()}>
            <span className="material-icons text-base">subscript</span>
          </IconButton>
        )}
        {enabledTools.has('superscript') && (
          <IconButton title="위첨자" active={editor.isActive('superscript')} onClick={() => editor.chain().focus().toggleSuperscript().run()}>
            <span className="material-icons text-base">superscript</span>
          </IconButton>
        )}
        {enabledTools.has('textColor') && (
          <input
            type="color"
            className="h-8 w-8 rounded-sm border border-slate-300 bg-white"
            value={editor.getAttributes('textStyle').color || '#000000'}
            onChange={(event) => setTextColor(event.target.value)}
            disabled={disabled}
            title="글자 색상"
          />
        )}
        {enabledTools.has('highlight') && (
          <IconButton title="형광펜" active={editor.isActive('highlight')} onClick={() => editor.chain().focus().toggleHighlight().run()}>
            <span className="material-icons text-base">highlight</span>
          </IconButton>
        )}

        {(enabledTools.has('clearFormat') || enabledTools.has('undo') || enabledTools.has('redo')) && <ToolbarDivider />}

        {enabledTools.has('clearFormat') && (
          <IconButton title="서식 초기화" onClick={clearFormatting}>
            <span className="material-icons text-base">format_clear</span>
          </IconButton>
        )}
        {enabledTools.has('undo') && (
          <IconButton
            title="실행 취소"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={disabled || !editor.can().chain().focus().undo().run()}
          >
            <span className="material-icons text-base">undo</span>
          </IconButton>
        )}
        {enabledTools.has('redo') && (
          <IconButton
            title="다시 실행"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={disabled || !editor.can().chain().focus().redo().run()}
          >
            <span className="material-icons text-base">redo</span>
          </IconButton>
        )}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-1 border-t border-slate-200 pt-2">
        <ToolbarDivider />

        {enabledTools.has('alignLeft') && (
          <IconButton title="좌측 정렬" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
            <span className="material-icons text-base">format_align_left</span>
          </IconButton>
        )}
        {enabledTools.has('alignCenter') && (
          <IconButton title="가운데 정렬" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
            <span className="material-icons text-base">format_align_center</span>
          </IconButton>
        )}
        {enabledTools.has('alignRight') && (
          <IconButton title="우측 정렬" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
            <span className="material-icons text-base">format_align_right</span>
          </IconButton>
        )}
        {enabledTools.has('alignJustify') && (
          <IconButton title="양쪽 정렬" active={editor.isActive({ textAlign: 'justify' })} onClick={() => editor.chain().focus().setTextAlign('justify').run()}>
            <span className="material-icons text-base">format_align_justify</span>
          </IconButton>
        )}

        <ToolbarDivider />

        {enabledTools.has('bulletList') && (
          <IconButton title="글머리 목록" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <span className="material-icons text-base">format_list_bulleted</span>
          </IconButton>
        )}
        {enabledTools.has('orderedList') && (
          <IconButton title="번호 목록" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            <span className="material-icons text-base">format_list_numbered</span>
          </IconButton>
        )}
        {enabledTools.has('blockquote') && (
          <IconButton title="인용" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
            <span className="material-icons text-base">format_quote</span>
          </IconButton>
        )}
        {enabledTools.has('code') && (
          <IconButton title="인라인 코드" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}>
            <span className="material-icons text-base">code</span>
          </IconButton>
        )}
        {enabledTools.has('codeBlock') && (
          <IconButton title="코드 블록" active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
            <span className="material-icons text-base">data_object</span>
          </IconButton>
        )}

        <ToolbarDivider />

        {(enabledTools.has('link') || enabledTools.has('image') || enabledTools.has('table') || enabledTools.has('horizontalRule')) && (
          <select
            className="h-8 min-w-[108px] rounded-sm border border-slate-300 bg-white px-2 text-xs text-slate-700"
            defaultValue=""
            onChange={(event) => {
              const action = event.target.value;
              handleInsertAction(action);
              event.target.value = '';
            }}
            disabled={disabled}
            title="삽입 메뉴"
          >
            <option value="">삽입</option>
            {enabledTools.has('link') && <option value="link">링크</option>}
            {enabledTools.has('image') && <option value="imageUrl">이미지 URL</option>}
            {enabledTools.has('image') && <option value="imageFile">이미지 파일</option>}
            {enabledTools.has('table') && <option value="table">표 추가</option>}
            {enabledTools.has('table') && <option value="tableDelete">표 삭제</option>}
            {enabledTools.has('horizontalRule') && <option value="horizontalRule">구분선</option>}
          </select>
        )}

        {enabledTools.has('image') && (
          <>
            <select
              className="h-8 min-w-[102px] rounded-sm border border-slate-300 bg-white px-2 text-xs text-slate-700"
              value={hasSelectedImage ? selectedImageAlign : 'center'}
              onChange={(event) => setImageAlign(event.target.value as 'left' | 'center' | 'right')}
              disabled={disabled || !hasSelectedImage}
              title="이미지 정렬"
            >
              {IMAGE_ALIGN_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  이미지 {option.label}
                </option>
              ))}
            </select>
            <select
              className="h-8 min-w-[92px] rounded-sm border border-slate-300 bg-white px-2 text-xs text-slate-700"
              value={hasSelectedImage ? selectedImageWidth : 640}
              onChange={(event) => setImageWidth(Number(event.target.value))}
              disabled={disabled || !hasSelectedImage}
              title="이미지 크기"
            >
              {IMAGE_SIZE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={addImageByFile}
        />

        </div>
      </div>

      <EditorContent
        editor={editor}
        className="editor-resize-surface min-h-44 px-4 py-3 focus:outline-none [&_.ProseMirror]:min-h-36 [&_.ProseMirror]:outline-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-slate-400 [&_.ProseMirror_img]:max-w-full [&_.ProseMirror_img]:h-auto [&_.ProseMirror_img[data-image-align=center]]:mx-auto [&_.ProseMirror_img[data-image-align=right]]:ml-auto [&_.ProseMirror_img[data-image-align=right]]:mr-0 [&_.ProseMirror_img[data-image-align=left]]:ml-0 [&_.ProseMirror_img[data-image-align=left]]:mr-auto [&_.ProseMirror_table]:w-full [&_.ProseMirror_table]:border-collapse [&_.ProseMirror_td]:border [&_.ProseMirror_td]:border-slate-300 [&_.ProseMirror_td]:p-2 [&_.ProseMirror_th]:border [&_.ProseMirror_th]:border-slate-300 [&_.ProseMirror_th]:p-2 [&_.ProseMirror_pre]:rounded-none [&_.ProseMirror_pre]:bg-slate-900 [&_.ProseMirror_pre]:p-3 [&_.ProseMirror_pre]:text-slate-100"
      />
    </div>
  );
}