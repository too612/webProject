import React from "react";
import { Editor } from "../../../common/editor";

interface EditorBlockProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<string>; // ★ 이미지 업로드 콜백
}

export function EditorBlock({
  value,
  onChange,
  required = true,
  placeholder = "내용을 입력해주세요.",
  onImageUpload,
}: Readonly<EditorBlockProps>) {
  return (
    <div>
      <span className="block text-sm font-medium text-gray-700 mb-1">
        내용 {required && <span className="text-red-500">*</span>}
      </span>
      <div className="[&_.editor-resize-surface]:min-h-[22rem] [&_.editor-resize-surface_.ProseMirror]:min-h-[20rem]">
        <Editor
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onImageUpload={onImageUpload}
        />
      </div>
    </div>
  );
}
