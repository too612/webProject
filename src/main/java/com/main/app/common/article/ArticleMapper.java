package com.main.app.common.article;

import com.main.app.common.article.dto.ArticleDto;
import com.main.app.common.article.dto.ArticleRequest;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface ArticleMapper {

    // ============================================================
    // 기존 CRUD
    // ============================================================
    List<ArticleDto> selectList(Map<String, Object> params);
    long countList(Map<String, Object> params);
    ArticleDto selectById(@Param("articleId") Long articleId);
    void updateViewCount(@Param("articleId") Long articleId);
    void insert(ArticleRequest request);
    void update(ArticleRequest request);
    void updateReplyOrder(Map<String, Object> params);
    void updateGroupId(@Param("articleId") Long articleId);
    void softDelete(@Param("articleId") Long articleId);

    // ============================================================
    // 이전/다음글
    // ============================================================
    Long selectPrevId(@Param("articleId") Long articleId,
                      @Param("menuKey") String menuKey,
                      @Param("templateCode") String templateCode,
                      @Param("sortField") String sortField,
                      @Param("sortOrder") String sortOrder);

    Long selectNextId(@Param("articleId") Long articleId,
                      @Param("menuKey") String menuKey,
                      @Param("templateCode") String templateCode,
                      @Param("sortField") String sortField,
                      @Param("sortOrder") String sortOrder);

    // ============================================================
    // 배너/슬라이드
    // ============================================================
    List<ArticleDto> selectBanners(Map<String, Object> params);
    void updateOrderNo(@Param("articleId") Long articleId, @Param("orderNo") int orderNo);

    // ★ 썸네일 업데이트 (추가)
    void updateThumbnail(@Param("articleId") Long articleId, @Param("fileId") Long fileId);
}