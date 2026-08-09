import React from "react";
import { Input } from "../../../common/ui";
import type { ArticleWriteForm } from "../ArticleModel";

interface CommonFieldsProps {
  form: ArticleWriteForm;
  setForm: React.Dispatch<React.SetStateAction<ArticleWriteForm>>;
  useAuthor?: boolean;
  useSecret?: boolean;
  isEdit?: boolean;
}

export function CommonFields({
  form,
  setForm,
  useAuthor = true,
  useSecret = true,
  isEdit = false,
}: Readonly<CommonFieldsProps>) {
  return (
    <>
      {useSecret && (
        <div>
          <span className="block text-sm font-medium text-gray-700 mb-1">
            비밀글
          </span>
          <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={form.secret}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, secret: e.target.checked }))
              }
            />
            <span>비밀글로 등록</span>
          </label>
        </div>
      )}

      <div>
        <label
          htmlFor="article-title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          제목 <span className="text-red-500">*</span>
        </label>
        <Input
          id="article-title"
          value={form.title}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, title: e.target.value }))
          }
          placeholder="제목을 입력해주세요."
        />
      </div>

      {useAuthor && (
        <div>
          <label
            htmlFor="article-author"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            작성자 <span className="text-red-500">*</span>
          </label>
          <Input
            id="article-author"
            value={form.author}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, author: e.target.value }))
            }
            placeholder="이름을 입력해주세요."
            readOnly={isEdit}
            className={isEdit ? "bg-muted" : undefined}
          />
        </div>
      )}
    </>
  );
}
