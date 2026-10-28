package com.main.app.common.attachment;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;

import com.main.app.common.attachment.dto.AttachmentDto;

/**
 * 공개(비로그인) 첨부 접근 판별 로직 단위 테스트.
 * <p>
 * 첨부는 파일 ID 만으로 조회되므로, 공개 도메인 화이트리스트와 게시글 비밀글 여부가 정확히 판별되어야
 * ID 열거로 비공개 파일이 내려가지 않는다.
 */
class AttachmentPublicAccessTest {

    private final Map<String, Boolean> postFlags = new HashMap<>();
    private final Map<String, Boolean> sermonFlags = new HashMap<>();
    private final AttachmentService attachmentService = new AttachmentService(
            new FakeAttachmentMapper(postFlags, sermonFlags));

    @Test
    void officialDomainAttachmentsArePubliclyDownloadable() {
        // official 공개 홈페이지에서 노출되는 도메인
        postFlags.put("55", Boolean.FALSE);
        sermonFlags.put("10", Boolean.FALSE);

        assertThat(attachmentService.isPubliclyDownloadable(file("post", "55", "attachment"))).isTrue();
        assertThat(attachmentService.isPubliclyDownloadable(file("sermon", "10", "attachment"))).isTrue();
        assertThat(attachmentService.isPubliclyDownloadable(file("history", "history-temp", "attachment"))).isTrue();
        assertThat(attachmentService.isPubliclyDownloadable(file("pastor", "1", "editor"))).isTrue();
    }

    @Test
    void nonOfficialDomainAttachmentsAreBlocked() {
        assertThat(attachmentService.isPubliclyDownloadable(file("erp", "1", "attachment"))).isFalse();
        assertThat(attachmentService.isPubliclyDownloadable(file("mypage", "1", "attachment"))).isFalse();
        assertThat(attachmentService.isPubliclyDownloadable(file(null, "1", "attachment"))).isFalse();
        assertThat(attachmentService.isPubliclyDownloadable(null)).isFalse();
    }

    @Test
    void publicPostAttachmentIsDownloadable() {
        postFlags.put("55", Boolean.FALSE);

        assertThat(attachmentService.isPubliclyDownloadable(file("post", "55", "attachment"))).isTrue();
    }

    @Test
    void secretPostAttachmentIsBlocked() {
        postFlags.put("55", Boolean.TRUE);

        assertThat(attachmentService.isPubliclyDownloadable(file("post", "55", "attachment"))).isFalse();
        assertThat(attachmentService.isPubliclyDownloadableGroup("post", "55")).isFalse();
    }

    @Test
    void secretSermonAttachmentIsBlocked() {
        sermonFlags.put("10", Boolean.TRUE);

        assertThat(attachmentService.isPubliclyDownloadable(file("sermon", "10", "attachment"))).isFalse();
        assertThat(attachmentService.isPubliclyDownloadableGroup("sermon", "10")).isFalse();
    }

    @Test
    void missingPostAttachmentIsBlocked() {
        // 게시글이 없거나 삭제된 경우(비밀글 플래그 null)는 공개하지 않는다.
        assertThat(attachmentService.isPubliclyDownloadable(file("post", "77", "attachment"))).isFalse();
        assertThat(attachmentService.isPubliclyDownloadable(file("sermon", "77", "attachment"))).isFalse();
    }

    @Test
    void tempEditorImageIsDownloadable() {
        // 게시글 저장 전 업로드된 본문 이미지(refId='temp')는 공개 본문에 노출되므로 허용한다.
        assertThat(attachmentService.isPubliclyDownloadable(file("post", "temp", "editor"))).isTrue();
        assertThat(attachmentService.isPubliclyDownloadable(file("post", "temp", null))).isTrue();
    }

    @Test
    void tempAttachmentIsBlocked() {
        // 임시 참조의 일반 첨부는 공개 대상이 아니다.
        assertThat(attachmentService.isPubliclyDownloadable(file("post", "temp", "attachment"))).isFalse();
        assertThat(attachmentService.isPubliclyDownloadableGroup("post", "temp")).isFalse();
    }

    @Test
    void groupCheckFollowsSecretFlag() {
        postFlags.put("55", Boolean.FALSE);
        sermonFlags.put("10", Boolean.FALSE);

        assertThat(attachmentService.isPubliclyDownloadableGroup("post", "55")).isTrue();
        assertThat(attachmentService.isPubliclyDownloadableGroup("sermon", "10")).isTrue();
        assertThat(attachmentService.isPubliclyDownloadableGroup("history", "1")).isTrue();
        assertThat(attachmentService.isPubliclyDownloadableGroup("erp", "10")).isFalse();
        assertThat(attachmentService.isPubliclyDownloadableGroup(null, "10")).isFalse();
    }

    private static AttachmentDto file(String pgmId, String refId, String fileUsage) {
        AttachmentDto dto = new AttachmentDto();
        dto.setPgmId(pgmId);
        dto.setRefId(refId);
        dto.setFileUsage(fileUsage);
        return dto;
    }

    /**
     * 비밀글 플래그만 응답하는 테스트용 매퍼.
     */
    private static final class FakeAttachmentMapper implements AttachmentMapper {

        private final Map<String, Boolean> postFlags;
        private final Map<String, Boolean> sermonFlags;

        private FakeAttachmentMapper(Map<String, Boolean> postFlags, Map<String, Boolean> sermonFlags) {
            this.postFlags = postFlags;
            this.sermonFlags = sermonFlags;
        }

        @Override
        public Boolean selectPostSecretFlag(String refId) {
            return postFlags.get(refId);
        }

        @Override
        public Boolean selectSermonSecretFlag(String refId) {
            return sermonFlags.get(refId);
        }

        @Override
        public int insertFile(AttachmentDto file) {
            throw new UnsupportedOperationException();
        }

        @Override
        public AttachmentDto selectFile(Long fileId) {
            throw new UnsupportedOperationException();
        }

        @Override
        public List<AttachmentDto> selectFileList(String pgmId, String refId) {
            throw new UnsupportedOperationException();
        }

        @Override
        public List<AttachmentDto> selectFileListByUsage(String pgmId, String refId, String fileUsage) {
            throw new UnsupportedOperationException();
        }

        @Override
        public int softDeleteFile(Long fileId) {
            throw new UnsupportedOperationException();
        }

        @Override
        public int softDeleteFilesByRef(String pgmId, String refId) {
            throw new UnsupportedOperationException();
        }
    }
}
