package com.main.app.official.worship.sermons;

import com.main.app.common.article.ArticleController;
import com.main.app.common.article.dto.ArticleDto;
import com.main.app.common.article.dto.ArticleRequest;
import com.main.app.common.dto.ApiResponse;
import com.main.app.official.worship.sermons.dto.SermonRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/official/worship/sermons")
@RequiredArgsConstructor
@Deprecated(forRemoval = true, since = "1.0")
public class SermonController {

    private final ArticleController articleController;

    @GetMapping
    public ApiResponse<Page<ArticleDto>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String searchType,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String sortField,
            @RequestParam(defaultValue = "ASC") String sortOrder) {
        return articleController.list("SERMON", null, page, size, searchType, keyword, sortField, sortOrder);
    }

    @GetMapping("/view")
    public ApiResponse<ArticleDto> view(@RequestParam("rqstNo") Long articleId,
                                        @RequestParam(required = false) String password) {
        return articleController.view(articleId, password);
    }

    @PostMapping("/check-password")
    public ApiResponse<Boolean> checkPassword(@RequestParam("rqstNo") Long articleId,
                                              @RequestParam("password") String password) {
        return articleController.verifyPassword(articleId, password);
    }

    @PostMapping("/write")
    public ApiResponse<ArticleDto> write(@RequestPart("request") SermonRequest legacyRequest,
                                         @RequestPart(value = "files", required = false) List<MultipartFile> files) {
        ArticleRequest newRequest = convertToArticleRequest(legacyRequest);
        newRequest.setFiles(files);
        return articleController.create(newRequest, files);
    }

    @PostMapping("/update")
    public ApiResponse<ArticleDto> update(@RequestPart("request") SermonRequest legacyRequest,
                                          @RequestPart(value = "files", required = false) List<MultipartFile> files) {
        ArticleRequest newRequest = convertToArticleRequest(legacyRequest);
        newRequest.setFiles(files);
        return articleController.update(newRequest.getArticleId(), newRequest, files);
    }

    @PostMapping("/delete")
    public ApiResponse<Void> delete(@RequestParam("rqstNo") Long articleId) {
        return articleController.delete(articleId);
    }

    /**
     * 레거시 SermonRequest → 신규 ArticleRequest 변환 (Jackson 미사용)
     */
    private ArticleRequest convertToArticleRequest(SermonRequest legacy) {
        ArticleRequest request = new ArticleRequest();
        request.setArticleId(legacy.getRqstNo());
        request.setTitle(legacy.getTitle());
        request.setCont(legacy.getCont());
        request.setRqstId(legacy.getRqstId());
        request.setMenuKey("SERMON");
        request.setTemplateCode("DEFAULT");
        request.setParentId(legacy.getParentNo());
        request.setPassword(legacy.getPassword());
        request.setSecret("Y".equals(legacy.getSecret()));

        // ★ 수동 JSON 생성 (Jackson 없이)
        String metadataJson = buildMetadataJson(legacy);
        request.setMetadata(metadataJson);

        request.setIsNotice(legacy.getIsNotice());
        request.setNoticeStartDt(legacy.getNoticeStartDt());
        request.setNoticeEndDt(legacy.getNoticeEndDt());
        request.setIsPopup(legacy.getIsPopup());
        request.setPopupStartDt(legacy.getPopupStartDt());
        request.setPopupEndDt(legacy.getPopupEndDt());
        request.setPopupLinkUrl(legacy.getPopupLinkUrl());
        request.setThumbnailFileId(legacy.getThumbnailFileId());
        request.setPopupDismissOption(legacy.getPopupDismissOption());

        return request;
    }

    /**
     * 수동 JSON 문자열 생성 (Jackson 미사용)
     */
    private String buildMetadataJson(SermonRequest legacy) {
        StringBuilder json = new StringBuilder("{");
        boolean first = true;

        if (legacy.getPreacherName() != null) {
            if (!first) json.append(",");
            json.append("\"preacher\":\"").append(escapeJson(legacy.getPreacherName())).append("\"");
            first = false;
        }
        if (legacy.getScriptureReference() != null) {
            if (!first) json.append(",");
            json.append("\"scripture\":\"").append(escapeJson(legacy.getScriptureReference())).append("\"");
            first = false;
        }
        if (legacy.getWorshipType() != null) {
            if (!first) json.append(",");
            json.append("\"worshipType\":\"").append(escapeJson(legacy.getWorshipType())).append("\"");
            first = false;
        }
        if (legacy.getSermonDate() != null) {
            if (!first) json.append(",");
            json.append("\"sermonDate\":\"").append(escapeJson(legacy.getSermonDate())).append("\"");
        }
        json.append("}");
        return json.toString();
    }

    /**
     * JSON 문자열 이스케이프 처리
     */
    private String escapeJson(String value) {
        if (value == null) return "";
        return value.replace("\\", "\\\\")
                    .replace("\"", "\\\"")
                    .replace("\n", "\\n")
                    .replace("\r", "\\r")
                    .replace("\t", "\\t");
    }
}