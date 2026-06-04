package com.main.app.common.file;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.main.app.common.file.dto.FileDto;

@Mapper
public interface FileMapper {

    void insertFile(FileDto fileDto);

    FileDto selectFile(@Param("fileId") Long fileId);

    List<FileDto> selectFileList(@Param("boardNo") String boardNo);

    int softDeleteFile(@Param("fileId") Long fileId);

    int softDeleteFilesByBoardNo(@Param("boardNo") String boardNo);
}
