package com.main.app.common.article;

import com.main.app.common.dto.ApiResponse;
import com.main.app.common.article.dto.ArticleDto;
import com.main.app.common.article.dto.ArticleRequest;
import com.main.app.common.article.dto.PrevNextDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/common/article")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService articleService;

    @GetMapping
    public ApiResponse<Page<ArticleDto>> list(
            @RequestParam(required = false) String menuKey,
            @RequestParam(required = false) String templateCode,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String searchType,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String sortField,
            @RequestParam(defaultValue = "ASC") String sortOrder) {
        return ApiResponse.ok(articleService.getList(menuKey, templateCode, page, size, searchType, keyword, sortField, sortOrder));
    }

    @GetMapping("/{articleId}")
    public ApiResponse<ArticleDto> view(@PathVariable Long articleId,
                                        @RequestParam(required = false) String password) {
        return ApiResponse.ok(articleService.getDetail(articleId, password, true));
    }

    @GetMapping("/{articleId}/prev-next")
    public ApiResponse<PrevNextDto> getPrevNext(
            @PathVariable Long articleId,
            @RequestParam String menuKey,
            @RequestParam String templateCode,
            @RequestParam(defaultValue = "created_at") String sortField,
            @RequestParam(defaultValue = "DESC") String sortOrder) {
        return ApiResponse.ok(articleService.getPrevNext(articleId, menuKey, templateCode, sortField, sortOrder));
    }

    @GetMapping("/banners")
    public ApiResponse<List<ArticleDto>> getBanners(
            @RequestParam String type,
            @RequestParam(required = false) Integer limit) {
        return ApiResponse.ok(articleService.getBanners(type, limit));
    }

    @PatchMapping("/slides/reorder")
    public ApiResponse<Void> reorderSlides(@RequestBody List<Long> slideIds) {
        articleService.reorderSlides(slideIds);
        return ApiResponse.ok(null, "슬라이드 순서가 변경되었습니다.");
    }

    @PostMapping
    public ApiResponse<ArticleDto> create(@RequestPart("request") ArticleRequest request,
                                          @RequestPart(value = "files", required = false) List<MultipartFile> files) {
        request.setFiles(files);
        return ApiResponse.ok(articleService.save(request));
    }

    @PutMapping("/{articleId}")
    public ApiResponse<ArticleDto> update(@PathVariable Long articleId,
                                          @RequestPart("request") ArticleRequest request,
                                          @RequestPart(value = "files", required = false) List<MultipartFile> files) {
        request.setArticleId(articleId);
        request.setFiles(files);
        return ApiResponse.ok(articleService.update(request));
    }

    @DeleteMapping("/{articleId}")
    public ApiResponse<Void> delete(@PathVariable Long articleId) {
        articleService.delete(articleId);
        return ApiResponse.ok(null);
    }

    @PostMapping("/{articleId}/verify-password")
    public ApiResponse<Boolean> verifyPassword(@PathVariable Long articleId, @RequestParam String password) {
        return ApiResponse.ok(articleService.verifyPassword(articleId, password));
    }
}