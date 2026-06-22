package com.main.app.common.article;

import com.main.app.common.article.dto.ArticleDto;
import com.main.app.common.article.dto.ArticleRequest;
import com.main.app.common.article.dto.PrevNextDto;
import com.main.app.common.article.strategy.BoardTemplateStrategy;
import com.main.app.common.attachment.AttachmentService;
import com.main.app.common.attachment.dto.AttachmentDto;
import com.main.app.common.comment.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ArticleService {

    private final ArticleMapper articleMapper;
    private final PasswordEncoder passwordEncoder;
    private final AttachmentService attachmentService;
    private final CommentService commentService;
    private final Map<String, BoardTemplateStrategy> strategyMap;

    @Transactional(readOnly = true)
    public Page<ArticleDto> getList(String menuKey, String templateCode, int page, int size,
                                    String searchType, String keyword, String sortField, String sortOrder) {
        Map<String, Object> params = new HashMap<>();
        params.put("menuKey", menuKey);
        params.put("templateCode", templateCode);
        params.put("searchType", searchType);
        params.put("keyword", keyword);
        params.put("sortField", sortField);
        params.put("sortOrder", sortOrder);
        params.put("offset", page * size);
        params.put("size", size);

        List<ArticleDto> list = articleMapper.selectList(params);
        long total = articleMapper.countList(params);
        return new PageImpl<>(list, PageRequest.of(page, size), total);
    }

    @Transactional
    public ArticleDto getDetail(Long articleId, String password, boolean increaseView) {
        ArticleDto article = articleMapper.selectById(articleId);
        if (article == null) {
            throw new RuntimeException("게시글이 존재하지 않습니다.");
        }

        if (Boolean.TRUE.equals(article.getIsSecret())) {
            if (!StringUtils.hasText(password)) {
                throw new RuntimeException("비밀글로 설정된 게시글은 비밀번호가 필요합니다.");
            }
            if (!passwordEncoder.matches(password, article.getPasswordHash())) {
                throw new RuntimeException("비밀번호가 일치하지 않습니다.");
            }
        }

        if (increaseView) {
            articleMapper.updateViewCount(articleId);
        }

        article.setFileList(attachmentService.getFileList("post", String.valueOf(articleId)));
        article.setCommentCount(commentService.countComments("post", String.valueOf(articleId)));

        BoardTemplateStrategy strategy = strategyMap.get(article.getTemplateCode());
        if (strategy != null) {
            strategy.afterLoad(article);
        }

        return article;
    }

    @Transactional(readOnly = true)
    public PrevNextDto getPrevNext(Long articleId, String menuKey, String templateCode, String sortField, String sortOrder) {
        ArticleDto current = articleMapper.selectById(articleId);
        if (current == null) {
            return new PrevNextDto(null, null, null, null);
        }

        Long prevId = articleMapper.selectPrevId(articleId, menuKey, templateCode, sortField, sortOrder);
        String prevTitle = null;
        if (prevId != null) {
            ArticleDto prev = articleMapper.selectById(prevId);
            if (prev != null) prevTitle = prev.getTitle();
        }

        Long nextId = articleMapper.selectNextId(articleId, menuKey, templateCode, sortField, sortOrder);
        String nextTitle = null;
        if (nextId != null) {
            ArticleDto next = articleMapper.selectById(nextId);
            if (next != null) nextTitle = next.getTitle();
        }

        return new PrevNextDto(prevId, nextId, prevTitle, nextTitle);
    }

    @Transactional(readOnly = true)
    public List<ArticleDto> getBanners(String type, Integer limit) {
        Map<String, Object> params = new HashMap<>();
        params.put("menuKey", "BANNER");
        params.put("templateCode", type);
        params.put("now", LocalDateTime.now());
        params.put("sortField", "order_no");
        params.put("sortOrder", "ASC");
        if (limit != null && limit > 0) {
            params.put("limit", limit);
        }
        return articleMapper.selectBanners(params);
    }

    @Transactional
    public void reorderSlides(List<Long> slideIds) {
        if (slideIds == null || slideIds.isEmpty()) {
            return;
        }
        for (int i = 0; i < slideIds.size(); i++) {
            articleMapper.updateOrderNo(slideIds.get(i), i);
        }
    }

    @Transactional
    public ArticleDto save(ArticleRequest request) {
        BoardTemplateStrategy strategy = strategyMap.get(request.getTemplateCode());
        if (strategy != null) {
            strategy.validate(request);
        }

        if (StringUtils.hasText(request.getPassword())) {
            request.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getParentId() != null && request.getParentId() > 0) {
            ArticleDto parent = articleMapper.selectById(request.getParentId());
            if (parent == null) {
                throw new RuntimeException("부모 글이 존재하지 않습니다.");
            }

            Long groupId = parent.getGroupId() != null ? parent.getGroupId() : request.getParentId();
            int newOrderNo = (parent.getOrderNo() != null ? parent.getOrderNo() : 0) + 1;

            Map<String, Object> replyParams = new HashMap<>();
            replyParams.put("groupId", groupId);
            replyParams.put("orderNo", newOrderNo);
            articleMapper.updateReplyOrder(replyParams);

            request.setGroupId(groupId);
            request.setDepth((parent.getDepth() != null ? parent.getDepth() : 0) + 1);
            request.setOrderNo(newOrderNo);
        } else {
            request.setDepth(0);
            request.setOrderNo(0);
        }

        articleMapper.insert(request);

        if (request.getParentId() == null || request.getParentId() == 0) {
            articleMapper.updateGroupId(request.getArticleId());
        }

        if (request.getFiles() != null && !request.getFiles().isEmpty()) {
            List<AttachmentDto> uploadedFiles = attachmentService.uploadFiles(
                    "post", String.valueOf(request.getArticleId()),
                    request.getFiles(), null, "0:0:0:0", "attachment");

            // ★ SINGLE_IMAGE/POPUP/SLIDE 템플릿이고 파일이 1개 이상이면 썸네일로 설정
            if (("SINGLE_IMAGE".equals(request.getTemplateCode()) ||
                 "POPUP".equals(request.getTemplateCode()) ||
                 "SLIDE".equals(request.getTemplateCode())) &&
                uploadedFiles != null && !uploadedFiles.isEmpty()) {
                articleMapper.updateThumbnail(request.getArticleId(), uploadedFiles.get(0).getFileId());
            }
        }

        return articleMapper.selectById(request.getArticleId());
    }

    @Transactional
    public ArticleDto update(ArticleRequest request) {
        ArticleDto existing = articleMapper.selectById(request.getArticleId());
        if (existing == null) {
            throw new RuntimeException("존재하지 않는 게시글입니다.");
        }

        if (StringUtils.hasText(request.getPassword()) && !request.getPassword().equals(existing.getPasswordHash())) {
            request.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }

        BoardTemplateStrategy strategy = strategyMap.get(request.getTemplateCode());
        if (strategy != null) {
            strategy.validate(request);
        }

        articleMapper.update(request);

        if (request.getFiles() != null && !request.getFiles().isEmpty()) {
            List<AttachmentDto> uploadedFiles = attachmentService.uploadFiles(
                    "post", String.valueOf(request.getArticleId()),
                    request.getFiles(), null, "0:0:0:0", "attachment");

            if (("SINGLE_IMAGE".equals(request.getTemplateCode()) ||
                 "POPUP".equals(request.getTemplateCode()) ||
                 "SLIDE".equals(request.getTemplateCode())) &&
                uploadedFiles != null && !uploadedFiles.isEmpty()) {
                articleMapper.updateThumbnail(request.getArticleId(), uploadedFiles.get(0).getFileId());
            }
        }

        return articleMapper.selectById(request.getArticleId());
    }

    @Transactional
    public void delete(Long articleId) {
        commentService.softDeleteCommentsByRef("post", String.valueOf(articleId));
        attachmentService.softDeleteFilesByRef("post", String.valueOf(articleId));
        articleMapper.softDelete(articleId);
    }

    @Transactional(readOnly = true)
    public boolean verifyPassword(Long articleId, String rawPassword) {
        ArticleDto article = articleMapper.selectById(articleId);
        if (article == null || !StringUtils.hasText(article.getPasswordHash())) {
            return false;
        }
        return passwordEncoder.matches(rawPassword, article.getPasswordHash());
    }
}