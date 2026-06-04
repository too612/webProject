package com.main.app.common.file;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.main.app.common.file.dto.FileDto;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class FileService {

    private final FileMapper fileMapper;

    @Value("${app.upload.path:./data/}")
    private String uploadBasePath;

    public FileService(FileMapper fileMapper) {
        this.fileMapper = fileMapper;
    }

    @Transactional
    public void uploadFiles(String boardNo,
            List<MultipartFile> files,
            String fileCategory,
            String menuKey,
            String uploaderId,
            String uploaderIp) {
        String normalizedCategory = defaultIfBlank(fileCategory, "board");
        String normalizedMenuKey = defaultIfBlank(menuKey, "common");

        LocalDate now = LocalDate.now();
        String year = String.format("%04d", now.getYear());
        String mmdd = String.format("%02d%02d", now.getMonthValue(), now.getDayOfMonth());

        String relativeDir;
        Path physicalDir;
        if ("photo".equalsIgnoreCase(normalizedCategory)) {
            relativeDir = "data/" + normalizedCategory + "/" + normalizedMenuKey;
            physicalDir = resolveUploadBasePath().resolve(normalizedCategory)
                    .resolve(normalizedMenuKey);
        } else {
            relativeDir = "data/" + normalizedCategory + "/" + year + "/" + mmdd + "/" + normalizedMenuKey;
            physicalDir = resolveUploadBasePath().resolve(normalizedCategory)
                    .resolve(year)
                    .resolve(mmdd)
                    .resolve(normalizedMenuKey);
        }

        if (files == null || files.isEmpty()) {
            return;
        }

        for (MultipartFile file : files) {
            if (file == null || file.isEmpty()) {
                continue;
            }

            try {
                String originalName = file.getOriginalFilename();
                String safeOriginalName = StringUtils.hasText(originalName) ? originalName : "unknown";
                String storedName = UUID.randomUUID() + "_" + safeOriginalName;

                Files.createDirectories(physicalDir);
                Path destination = physicalDir.resolve(storedName).toAbsolutePath().normalize();

                file.transferTo(destination);

                FileDto fileDto = new FileDto();
                fileDto.setBoardNo(boardNo);
                fileDto.setOrgFileNm(safeOriginalName);
                fileDto.setStoredFileNm(storedName);
                fileDto.setFileSize(file.getSize());
                fileDto.setFilePath(destination.toString());
                fileDto.setFileCategory(normalizedCategory);
                fileDto.setMenuKey(normalizedMenuKey);
                fileDto.setPathYear(year);
                fileDto.setPathMmdd(mmdd);
                fileDto.setRelativeDir(relativeDir);
                fileDto.setRelativePath(relativeDir + "/" + storedName);
                fileDto.setFileExt(extractExtension(safeOriginalName));
                fileDto.setMimeType(file.getContentType());
                fileDto.setUploaderId(uploaderId);
                fileDto.setUploaderIp(uploaderIp);
                fileDto.setIsDeleted(false);
                fileMapper.insertFile(fileDto);
            } catch (Exception e) {
                log.error(
                        "File upload failed: boardNo={}, category={}, menuKey={}, uploaderId={}, uploaderIp={}, originalName={}, uploadBasePath={}",
                        boardNo,
                        normalizedCategory,
                        normalizedMenuKey,
                        uploaderId,
                        uploaderIp,
                        file != null ? file.getOriginalFilename() : null,
                        uploadBasePath,
                        e);
                throw new IllegalStateException("첨부파일 저장 중 오류가 발생했습니다.", e);
            }
        }
    }

    public List<FileDto> getFileList(String boardNo) {
        return fileMapper.selectFileList(boardNo);
    }

    public FileDto getFile(Long fileId) {
        return fileMapper.selectFile(fileId);
    }

    @Transactional
    public boolean softDeleteFile(Long fileId) {
        return fileMapper.softDeleteFile(fileId) > 0;
    }

    @Transactional
    public int softDeleteFilesByBoardNo(String boardNo) {
        return fileMapper.softDeleteFilesByBoardNo(boardNo);
    }

    private String extractExtension(String fileName) {
        if (!StringUtils.hasText(fileName)) {
            return "";
        }

        int idx = fileName.lastIndexOf('.');
        if (idx < 0 || idx == fileName.length() - 1) {
            return "";
        }

        return fileName.substring(idx + 1).toLowerCase();
    }

    private String defaultIfBlank(String value, String defaultValue) {
        if (!StringUtils.hasText(value)) {
            return defaultValue;
        }
        return value.trim();
    }

    private Path resolveUploadBasePath() {
        Path base = Paths.get(uploadBasePath);
        if (!base.isAbsolute()) {
            base = Paths.get(System.getProperty("user.dir")).resolve(base);
        }
        return base.toAbsolutePath().normalize();
    }
}
