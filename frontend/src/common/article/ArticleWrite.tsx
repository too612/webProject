import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useArticle } from "./ArticleHook";
import { useAttachment } from "../../common/attachment";
import { attachmentApi } from "../../common/attachment";
import { getArticleTemplateConfig } from "./config";
import {
  WriteLayout,
  CommonFields,
  MetaFieldsBlock,
  EditorBlock,
  AttachmentBlock,
  PasswordFields,
} from "./blocks";

export function ArticleWrite({
  templateCode,
  basePath,
}: Readonly<{ templateCode: string; basePath: string }>) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const articleId = searchParams.get("rqstNo");
  const isEdit = Boolean(articleId);

  const config = getArticleTemplateConfig(templateCode);
  const {
    form,
    setForm,
    writeLoading,
    writeError,
    saveArticle,
    loadView,
    article,
  } = useArticle();
  const attachment = useAttachment();

  // ★ 배너 전용: 유형 선택 (라디오 버튼)
  const isBanner = config.menuKey === "BANNER";
  const [bannerType, setBannerType] = React.useState<"POPUP" | "SLIDE">(
    templateCode as "POPUP" | "SLIDE",
  );

  // 수정 데이터 로드
  useEffect(() => {
    if (isEdit && articleId) {
      loadView(Number(articleId));
    }
  }, [isEdit, articleId]);

  // article -> form 매핑
  useEffect(() => {
    if (isEdit && article) {
      let metadata = {};
      try {
        metadata =
          typeof article.metadata === "string"
            ? JSON.parse(article.metadata)
            : article.metadata || {};
      } catch {
        metadata = {};
      }

      setForm({
        title: article.title ?? "",
        author: article.authorId ?? "",
        content: article.contentHtml ?? "",
        password: "",
        confirmPassword: "",
        secret: article.isSecret ?? false,
        menuKey: config.menuKey,
        templateCode: config.templateCode,
        metadata: metadata,
      });

      if (isBanner) {
        setBannerType(article.templateCode as "POPUP" | "SLIDE");
      }

      if (article.fileList?.length) {
        attachment.reset(
          article.fileList.map((f: any) => ({
            fileId: f.fileId,
            orgFileNm: f.orgFileNm ?? f.storedFileNm,
            fileSize: f.fileSize,
          })),
        );
      }
    }
  }, [isEdit, article]);

  const updateMetadata = (key: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, [key]: value },
    }));
  };

  // ★ 에디터 이미지 업로드 핸들러
  const handleImageUpload = async (file: File): Promise<string> => {
    const refId = articleId || "temp";
    const result = await attachmentApi.upload(file, "post", refId, "editor");
    return `/api/common/files/${result.fileId}/download`;
  };

  const handleAddFiles = (files: File[]) => {
    attachment.addFiles(files);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ★ 배너인 경우 templateCode를 bannerType으로 덮어쓰기
    const finalTemplateCode = isBanner ? bannerType : config.templateCode;

    if (!form.title) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (config.write.features.useAuthor && !form.author) {
      alert("작성자를 입력해주세요.");
      return;
    }
    if (config.write.features.usePassword && !form.password) {
      alert("비밀번호를 입력해주세요.");
      return;
    }
    if (form.password && form.password.length < 4) {
      alert("비밀번호는 4자 이상이어야 합니다.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const payload: any = {
        title: form.title,
        cont: form.content,
        rqstId: form.author,
        menuKey: config.menuKey,
        templateCode: finalTemplateCode,
        secret: form.secret,
        password: form.password,
        metadata: JSON.stringify(form.metadata),
        // ★ 배너용 추가 필드
        popupDismissOption: form.metadata?.popupDismissOption || "DAY",
      };

      const formData = new FormData();

      if (isEdit && articleId) {
        payload.postId = Number(articleId);
        formData.append("postId", String(payload.postId));
      }

      formData.append(
        "request",
        new Blob([JSON.stringify(payload)], { type: "application/json" }),
      );

      attachment.newFiles.forEach((f: File) => {
        formData.append("files", f);
      });

      await saveArticle(formData, isEdit, payload.postId);

      if (attachment.deletedFileIds.length > 0) {
        await Promise.all(
          attachment.deletedFileIds.map((id: string | number) =>
            fetch(`/api/common/files/${id}`, { method: "DELETE" }),
          ),
        );
      }

      alert(isEdit ? "수정 완료" : "등록 완료");
      navigate(basePath);
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const features = config.write.features;
  const isLoading = writeLoading;
  const isSingleImage = features.useAttachment === "single-image";
  const showAttachment =
    features.useAttachment === "multiple" ||
    features.useAttachment === "single-image";

  return (
    <WriteLayout
      title={isEdit ? "수정" : `${config.title} 작성`}
      onSubmit={onSubmit}
      onCancel={() => navigate(basePath)}
      error={writeError}
      loading={isLoading}
    >
      {/* ★ 배너 유형 선택 (라디오 버튼) */}
      {isBanner && (
        <div className="border border-slate-200 rounded-md p-4 bg-slate-50/60">
          <span className="block text-sm font-medium text-gray-700 mb-2">
            배너 유형 선택
          </span>
          <div className="flex gap-6">
            <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="bannerType"
                value="POPUP"
                checked={bannerType === "POPUP"}
                onChange={(e) =>
                  setBannerType(e.target.value as "POPUP" | "SLIDE")
                }
              />
              팝업
            </label>
            <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="bannerType"
                value="SLIDE"
                checked={bannerType === "SLIDE"}
                onChange={(e) =>
                  setBannerType(e.target.value as "POPUP" | "SLIDE")
                }
              />
              슬라이드
            </label>
          </div>
        </div>
      )}

      <CommonFields
        form={form}
        setForm={setForm}
        useAuthor={features.useAuthor}
        useSecret={features.useSecret}
        isEdit={isEdit}
      />

      {config.write.extraFields.length > 0 && (
        <MetaFieldsBlock
          fields={config.write.extraFields}
          metadata={form.metadata}
          updateMetadata={updateMetadata}
        />
      )}

      {features.useEditor && (
        <EditorBlock
          value={form.content}
          onChange={(v: string) => setForm((prev) => ({ ...prev, content: v }))}
          onImageUpload={handleImageUpload}
        />
      )}

      {showAttachment && (
        <AttachmentBlock
          existingFiles={attachment.existingFiles}
          newFiles={attachment.newFiles}
          onAdd={handleAddFiles}
          onRemoveExisting={attachment.removeExisting}
          onRemoveNew={attachment.removeNew}
          maxFiles={config.write.attachmentLimits?.maxFiles}
          maxFileSize={config.write.attachmentLimits?.maxFileSize}
          singleImage={isSingleImage}
        />
      )}

      {features.usePassword && (
        <PasswordFields
          password={form.password}
          confirmPassword={form.confirmPassword}
          setForm={setForm}
        />
      )}
    </WriteLayout>
  );
}
