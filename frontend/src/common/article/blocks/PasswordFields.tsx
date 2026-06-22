import React from "react";
import type { ArticleWriteForm } from "../ArticleModel";

const fieldCls =
  "w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white";

interface PasswordFieldsProps {
  password: string;
  confirmPassword: string;
  setForm: React.Dispatch<React.SetStateAction<ArticleWriteForm>>;
}

export function PasswordFields({
  password,
  confirmPassword,
  setForm,
}: Readonly<PasswordFieldsProps>) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label
          htmlFor="article-password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          비밀번호 <span className="text-red-500">*</span>
        </label>
        <input
          id="article-password"
          className={fieldCls}
          type="password"
          value={password}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, password: e.target.value }))
          }
          placeholder="비밀번호 (4자 이상)"
        />
      </div>
      <div>
        <label
          htmlFor="article-password-confirm"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          비밀번호 확인 <span className="text-red-500">*</span>
        </label>
        <input
          id="article-password-confirm"
          className={fieldCls}
          type="password"
          value={confirmPassword}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
          }
          placeholder="비밀번호 재입력"
        />
        {confirmPassword && password !== confirmPassword && (
          <p className="mt-1 text-xs text-red-500">
            비밀번호가 일치하지 않습니다.
          </p>
        )}
      </div>
    </div>
  );
}
