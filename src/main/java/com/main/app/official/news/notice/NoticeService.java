package com.main.app.official.news.notice;

import com.main.app.common.article.ArticleService;
import com.main.app.common.article.dto.ArticleDto;
import com.main.app.common.article.dto.ArticleRequest;
import com.main.app.common.attachment.AttachmentService;
import com.main.app.common.attachment.dto.AttachmentDto;
import com.main.app.common.comment.CommentService;
import com.main.app.official.news.notice.dto.NoticeDto;
import com.main.app.official.news.notice.dto.NoticeRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class NoticeService {

    private static final String MENU_KEY = "PINNABLE";
    private static final String TEMPLATE_CODE = "PINNABLE";
    private static final String COMMENT_PGM_ID = "post";

    private final ArticleService articleService;
    private final AttachmentService fileService;
    private final CommentService commentService;

    public NoticeService(ArticleService articleService,
                         AttachmentService fileService,
                         CommentService commentService) {
        this.articleService = articleService;
        this.fileService = fileService;
        this.commentService = commentService;
    }

    public Page<NoticeDto> getBoardList(Pageable pageable, String searchType, String keyword) {
        Page<ArticleDto> articlePage = articleService.getList(
                MENU_KEY,
                TEMPLATE_CODE,
                pageable.getPageNumber(),
                pageable.getPageSize(),
                searchType,
                keyword,
            null,
            null,
                null,
                null);
        return articlePage.map(this::toNoticeDto);
    }

    public NoticeDto getBoardDetail(String rqstNo, boolean increaseViewCount) {
        Long articleId = parseLong(rqstNo);
        if (articleId == null) {
            return null;
        }
        return toNoticeDto(articleService.getDetail(articleId, null, increaseViewCount));
    }

    @Transactional
    public void saveBoard(NoticeRequest request, List<MultipartFile> files) {
        ArticleRequest articleRequest = toArticleRequest(request, files);
        if (articleRequest.getArticleId() == null) {
            articleService.save(articleRequest);
        } else {
            articleService.update(articleRequest);
        }
    }

    @Transactional
    public void updateBoard(NoticeRequest request, List<MultipartFile> files) {
        ArticleRequest articleRequest = toArticleRequest(request, files);
        if (articleRequest.getArticleId() != null) {
            articleService.update(articleRequest);
        }
    }

    @Transactional
    public void deleteBoard(String rqstNo) {
        Long articleId = parseLong(rqstNo);
        if (articleId == null) {
            return;
        }
        articleService.delete(articleId);
    }

    public AttachmentDto getFile(Long fileId) {
        return fileService.getFile(fileId);
    }

    public List<com.main.app.common.dto.CommentDto> getCommentList(String boardNo) {
        List<com.main.app.common.comment.dto.CommentDto> comments =
                commentService.getCommentList(COMMENT_PGM_ID, boardNo);
        List<com.main.app.common.dto.CommentDto> legacyComments = new ArrayList<>();
        for (com.main.app.common.comment.dto.CommentDto comment : comments) {
            legacyComments.add(toLegacyCommentDto(comment));
        }
        return legacyComments;
    }

    public void saveComment(com.main.app.common.dto.CommentDto comment) {
        com.main.app.common.comment.dto.CommentDto articleComment = new com.main.app.common.comment.dto.CommentDto();
        articleComment.setPgmId(COMMENT_PGM_ID);
        articleComment.setRefId(comment.getBoardNo());
        articleComment.setParentCommentId(comment.getParentCommentId());
        articleComment.setWriter(comment.getWriter());
        articleComment.setContent(comment.getContent());
        articleComment.setSecret(comment.getSecret());
        articleComment.setPassword(comment.getPassword());
        articleComment.setSpoiler(comment.getSpoiler());
        articleComment.setInsId(comment.getWriter());
        commentService.saveComment(articleComment);
    }

    public com.main.app.common.dto.CommentDto getComment(Long commentId) {
        com.main.app.common.comment.dto.CommentDto comment = commentService.getComment(commentId);
        return comment == null ? null : toLegacyCommentDto(comment);
    }

    public void handleVote(Long commentId, String action, String previousVote) {
        commentService.handleVote(commentId, action, previousVote);
    }

    public boolean isValidPassword(String rqstNo, String rawPassword) {
        Long articleId = parseLong(rqstNo);
        if (articleId == null || !StringUtils.hasText(rawPassword)) {
            return false;
        }
        return articleService.verifyPassword(articleId, rawPassword);
    }

    private ArticleRequest toArticleRequest(NoticeRequest request, List<MultipartFile> files) {
        ArticleRequest articleRequest = new ArticleRequest();
        articleRequest.setArticleId(parseLong(request.getRqstNo()));
        articleRequest.setTitle(request.getTitle());
        articleRequest.setCont(request.getCont());
        articleRequest.setRqstId(request.getRqstId());
        articleRequest.setMenuKey(MENU_KEY);
        articleRequest.setTemplateCode(TEMPLATE_CODE);
        articleRequest.setParentId(parseLong(request.getParentNo()));
        articleRequest.setPassword(request.getPassword());
        articleRequest.setSecret("Y".equals(request.getSecret()));
        articleRequest.setFiles(files);
        return articleRequest;
    }

    private NoticeDto toNoticeDto(ArticleDto article) {
        if (article == null) {
            return null;
        }

        NoticeDto notice = new NoticeDto();
        notice.setRqstNo(article.getArticleId() == null ? null : String.valueOf(article.getArticleId()));
        notice.setTitle(article.getTitle());
        notice.setCont(article.getContentHtml());
        notice.setRqstId(article.getAuthorId());
        notice.setInsDt(article.getCreatedAt());
        notice.setUptDt(article.getUpdatedAt());
        notice.setViews(article.getViewCount());
        notice.setBoardType("NOTICE");
        notice.setGroupNo(article.getGroupId() == null ? null : String.valueOf(article.getGroupId()));
        notice.setParentNo(article.getParentId() == null ? null : String.valueOf(article.getParentId()));
        notice.setDepth(article.getDepth());
        notice.setOrderNo(article.getOrderNo());
        notice.setHasFile(article.getFileCount() != null && article.getFileCount() > 0);
        notice.setTotalFileSize(0L);
        notice.setSecret(Boolean.TRUE.equals(article.getIsSecret()) ? "Y" : "N");
        notice.setPassword(article.getPasswordHash());
        notice.setCommentCount(article.getCommentCount());
        return notice;
    }

    private com.main.app.common.dto.CommentDto toLegacyCommentDto(com.main.app.common.comment.dto.CommentDto comment) {
        com.main.app.common.dto.CommentDto legacy = new com.main.app.common.dto.CommentDto();
        legacy.setCommentId(comment.getCommentId());
        legacy.setBoardNo(comment.getRefId());
        legacy.setWriter(comment.getWriter());
        legacy.setContent(comment.getContent());
        legacy.setInsDt(comment.getInsDt());
        legacy.setLikes(comment.getLikes());
        legacy.setParentCommentId(comment.getParentCommentId());
        legacy.setDislikes(comment.getDislikes() == null ? 0 : comment.getDislikes());
        legacy.setSecret(comment.getSecret());
        legacy.setPassword(comment.getPassword());
        legacy.setSpoiler(comment.getSpoiler());

        if (comment.getReplies() != null && !comment.getReplies().isEmpty()) {
            List<com.main.app.common.dto.CommentDto> replies = new ArrayList<>();
            for (com.main.app.common.comment.dto.CommentDto reply : comment.getReplies()) {
                replies.add(toLegacyCommentDto(reply));
            }
            legacy.setReplies(replies);
        }

        return legacy;
    }

    private Long parseLong(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        if (!value.matches("^-?\\d+$")) {
            return null;
        }
        return Long.parseLong(value);
    }
}