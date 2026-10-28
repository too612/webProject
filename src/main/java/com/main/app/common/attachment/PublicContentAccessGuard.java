package com.main.app.common.attachment;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.main.app.common.attachment.dto.AttachmentDto;

/**
 * 비로그인(공개) 사용자의 콘텐츠 접근 허용 여부를 판단한다.
 * <p>
 * official 은 공개 홈페이지이므로 조회·첨부 다운로드·댓글 조회를 로그인 없이 허용하지만, 첨부·댓글은
 * pgmId/refId(또는 파일 ID)만으로 조회되기 때문에 그대로 열어 두면 ID 열거로 비공개 콘텐츠까지 노출된다.
 * 따라서 공개 도메인 화이트리스트와 게시글 비밀글 여부를 확인하고, 통과하지 못하면 컨트롤러가
 * 404(첨부) 또는 빈 목록(댓글·파일 목록)으로 응답하도록 한다.
 * <p>
 * 로그인 사용자(관리자·스템프)는 이 검사와 무관하게 기존과 동일하게 접근한다.
 */
@Component
public class PublicContentAccessGuard {

    private final AttachmentService attachmentService;

    public PublicContentAccessGuard(AttachmentService attachmentService) {
        this.attachmentService = attachmentService;
    }

    /**
     * 비로그인 사용자에게 이 파일을 내려주면 안 되는가?
     */
    public boolean isFileBlocked(AttachmentDto file) {
        return isAnonymous() && !attachmentService.isPubliclyDownloadable(file);
    }

    /**
     * 비로그인 사용자에게 이 그룹(pgmId + refId)의 목록·ZIP·댓글을 내려주면 안 되는가?
     */
    public boolean isGroupBlocked(String pgmId, String refId) {
        return isAnonymous() && !attachmentService.isPubliclyDownloadableGroup(pgmId, refId);
    }

    /**
     * 현재 요청이 인증되지 않은(익명) 상태인지 확인한다.
     */
    private static boolean isAnonymous() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication == null
                || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken;
    }
}
