export * from "./templateConfig";
export * from "./templates/ArticleDefault";
export * from "./templates/ArticlePinnable";
export * from "./templates/ArticleGallery";
export * from "./templates/ArticleSingleImage";
export * from "./templates/ArticlePopup";
export * from "./templates/ArticleSlide";
export * from "./templates/ArticleSchoolGallery";
export * from "./templates/ArticleOutreachGallery";
export * from "./templates/ArticleYouthGallery";
// ★ ./banner import 제거 (banner는 config 하위가 아님)
export { getArticleTemplateConfig } from "./templateConfig";
export type {
  FieldConfig,
  ListConfig,
  ViewConfig,
  WriteConfig,
  ArticleTemplateConfig,
} from "./templateConfig";
