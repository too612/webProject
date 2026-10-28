package com.main.app.common.attachment;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.main.app.common.attachment.dto.AttachmentDto;

/**
 * 공개 첨부 판별용 매퍼 쿼리 검증.
 * <p>
 * 실제 DB(PostgreSQL)에 대해 {@code selectPostSecretFlag} 가 동작하는지 확인한다. 이 쿼리는 비밀글 여부를
 * 조회하므로 문법 오류가 있으면 비로그인 다운로드 전체가 실패한다.
 */
@SpringBootTest
class AttachmentPublicFlagQueryTest {

    @Autowired
    private AttachmentMapper attachmentMapper;

    @Autowired
    private AttachmentService attachmentService;

    @Test
    void returnsNullWhenPostDoesNotExist() {
        assertThat(attachmentMapper.selectPostSecretFlag("999999999")).isNull();
    }

    @Test
    void unknownPostAttachmentIsNotPublic() {
        AttachmentDto file = new AttachmentDto();
        file.setPgmId("post");
        file.setRefId("999999999");
        file.setFileUsage("attachment");

        assertThat(attachmentService.isPubliclyDownloadable(file)).isFalse();
    }

    /**
     * official_sermon 테이블이 없는 환경에서도 예외 없이 비공개(404)로 처리되는지 확인한다.
     */
    @Test
    void unknownSermonAttachmentIsNotPublic() {
        AttachmentDto file = new AttachmentDto();
        file.setPgmId("sermon");
        file.setRefId("999999999");
        file.setFileUsage("attachment");

        assertThat(attachmentService.isPubliclyDownloadable(file)).isFalse();
    }
}
