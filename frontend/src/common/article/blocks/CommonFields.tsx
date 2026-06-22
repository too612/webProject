import React from "react";
import type { ArticleWriteForm } from "../ArticleModel";

const fieldCls =
  "w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white";

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
            비밀글로 등록
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
        <input
          id="article-title"
          className={fieldCls}
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
          <input
            id="article-author"
            className={fieldCls}
            value={form.author}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, author: e.target.value }))
            }
            placeholder="이름을 입력해주세요."
            readOnly={isEdit}
          />
        </div>
      )}
    </>
  );
}
