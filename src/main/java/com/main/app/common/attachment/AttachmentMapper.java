package com.main.app.common.attachment;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.main.app.common.attachment.dto.AttachmentDto;

@Mapper
public interface AttachmentMapper {

    /**
     * 파일 단건 등록 (AttachmentDto에 fileUsage 포함)
     */
    int insertFile(AttachmentDto file);

    /**
     * 파일 단건 조회
     */
    AttachmentDto selectFile(@Param("fileId") Long fileId);

    /**
     * 게시글(post) 첨부의 공개 여부 판별용 비밀글 플래그 조회
     * <p>
     * 게시글이 없거나 삭제된 경우 null 을 반환한다(공개 대상 아님으로 판단).
     *
     * @param refId com_file.ref_id (게시글 번호)
     */
    Boolean selectPostSecretFlag(@Param("refId") String refId);

    /**
     * 설교(sermon) 첨부의 공개 여부 판별용 비밀글 플래그 조회
     * <p>
     * 설교가 없거나 삭제된 경우 null 을 반환한다(공개 대상 아님으로 판단).
     *
     * @param refId com_file.ref_id (설교 번호)
     */
    Boolean selectSermonSecretFlag(@Param("refId") String refId);

    /**
     * pgmId + refId 기준 파일 목록 조회 (file_usage='attachment'만 기본 조회)
     */
    List<AttachmentDto> selectFileList(@Param("pgmId") String pgmId, @Param("refId") String refId);

    /**
     * pgmId + refId + fileUsage 기준 파일 목록 조회 (선택적 필터)
     */
    List<AttachmentDto> selectFileListByUsage(@Param("pgmId") String pgmId,
            @Param("refId") String refId,
            @Param("fileUsage") String fileUsage);

    /**
     * 파일 단건 소프트 삭제
     */
    int softDeleteFile(@Param("fileId") Long fileId);

    /**
     * pgmId + refId 기준 전체 소프트 삭제
     */
    int softDeleteFilesByRef(@Param("pgmId") String pgmId, @Param("refId") String refId);
}