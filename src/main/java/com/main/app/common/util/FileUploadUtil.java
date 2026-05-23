package com.main.app.common.util;

import java.io.File;
import java.util.List;
import java.util.UUID;
import java.util.function.Consumer;

import org.springframework.web.multipart.MultipartFile;

import com.main.app.common.dto.FileDto;

public final class FileUploadUtil {

    private FileUploadUtil() {
    }

    public static void saveFiles(String boardNo,
            List<MultipartFile> files,
            String uploadPath,
            Consumer<FileDto> fileRegistrar) {
        if (files == null || files.isEmpty()) {
            return;
        }

        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                continue;
            }

            try {
                String originalName = file.getOriginalFilename();
                String storedName = UUID.randomUUID() + "_" + originalName;
                File dest = new File(uploadPath + storedName);
                File parent = dest.getParentFile();
                if (parent != null && !parent.exists()) {
                    parent.mkdirs();
                }
                file.transferTo(dest);

                FileDto fileDto = new FileDto();
                fileDto.setBoardNo(boardNo);
                fileDto.setOrgFileNm(originalName);
                fileDto.setStoredFileNm(storedName);
                fileDto.setFileSize(file.getSize());
                fileDto.setFilePath(dest.getAbsolutePath());
                fileRegistrar.accept(fileDto);
            } catch (Exception e) {
                throw new IllegalStateException("첨부파일 저장 중 오류가 발생했습니다.", e);
            }
        }
    }
}