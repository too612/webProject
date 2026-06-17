package com.main.app.common.file;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.main.app.common.file.dto.FileDto;

@Mapper
public interface FileMapper {

    /**
     * 파일 단건 등록 (FileDto에 fileUsage 포함)
     */
    int insertFile(FileDto file);

    /**
     * 파일 단건 조회
     */
    FileDto selectFile(@Param("fileId") Long fileId);

    /**
     * pgmId + refId 기준 파일 목록 조회 (file_usage='attachment'만 기본 조회)
     */
    List<FileDto> selectFileList(@Param("pgmId") String pgmId, @Param("refId") String refId);

    /**
     * pgmId + refId + fileUsage 기준 파일 목록 조회 (선택적 필터)
     */
    List<FileDto> selectFileListByUsage(@Param("pgmId") String pgmId,
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