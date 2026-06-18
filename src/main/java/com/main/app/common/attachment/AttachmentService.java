package com.main.app.common.attachment;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.main.app.common.attachment.dto.AttachmentDto;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AttachmentService {

    private final AttachmentMapper attachmentMapper;

    // 파일 저장 루트 경로 (application.properties에서 주입 가능)
    private static final String FILE_STORAGE_ROOT = "./data/";

    public AttachmentService(AttachmentMapper attachmentMapper) {
        this.attachmentMapper = attachmentMapper;
    }

    /**
     * 파일 단건 업로드 (fileUsage 지정)
     */
    @Transactional
    public AttachmentDto uploadFile(String pgmId, String refId, MultipartFile file,
            String description, String uploaderIp, String fileUsage) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("업로드할 파일이 비어 있습니다.");
        }

        try {
            // 1. 원본 파일명 정리
            String originalFilename = file.getOriginalFilename();
            if (!StringUtils.hasText(originalFilename)) {
                originalFilename = "unknown";
            }

            // 2. 저장 파일명 생성 (UUID + 원본 확장자)
            String extension = "";
            int dotIndex = originalFilename.lastIndexOf('.');
            if (dotIndex > 0) {
                extension = originalFilename.substring(dotIndex);
            }
            String storedFileName = UUID.randomUUID().toString() + extension;

            // 3. 저장 경로 생성: data/{pgmId}/{yyyy}/{MMdd}/
            String year = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy"));
            String monthDay = LocalDate.now().format(DateTimeFormatter.ofPattern("MMdd"));
            String relativeDir = pgmId + "/" + year + "/" + monthDay;
            String fullDirPath = FILE_STORAGE_ROOT + relativeDir;

            // 4. 디렉토리 생성
            Path dirPath = Paths.get(fullDirPath);
            if (!Files.exists(dirPath)) {
                Files.createDirectories(dirPath);
            }

            // 5. 파일 저장
            String fullFilePath = fullDirPath + "/" + storedFileName;
            Path targetPath = Paths.get(fullFilePath);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            // 6. AttachmentDto 생성
            AttachmentDto attachmentDto = new AttachmentDto();
            attachmentDto.setPgmId(pgmId);
            attachmentDto.setRefId(refId);
            attachmentDto.setOrgFileNm(originalFilename);
            attachmentDto.setStoredFileNm(storedFileName);
            attachmentDto.setFilePath(fullFilePath);
            attachmentDto.setRelativePath(relativeDir + "/" + storedFileName);
            attachmentDto.setFileExt(extension.isEmpty() ? null : extension.substring(1));
            attachmentDto.setMimeType(file.getContentType());
            attachmentDto.setFileSize(file.getSize());
            attachmentDto.setDescription(description);
            attachmentDto.setUploaderIp(uploaderIp);
            attachmentDto.setUploaderId("system");
            attachmentDto.setInsId("system");
            attachmentDto.setFileUsage(StringUtils.hasText(fileUsage) ? fileUsage : "attachment");

            // 7. DB 저장
            attachmentMapper.insertFile(attachmentDto);

            log.info("File uploaded: pgmId={}, refId={}, fileId={}, usage={}",
                    pgmId, refId, attachmentDto.getFileId(), attachmentDto.getFileUsage());
            return attachmentDto;

        } catch (IOException e) {
            log.error("File upload failed: {}", e.getMessage(), e);
            throw new RuntimeException("파일 업로드 중 오류가 발생했습니다.", e);
        }
    }

    /**
     * 여러 파일을 한 번에 업로드 (fileUsage 기본값 'attachment')
     */
    @Transactional
    public List<AttachmentDto> uploadFiles(String pgmId, String refId, List<MultipartFile> files,
            String description, String uploaderIp) {
        return uploadFiles(pgmId, refId, files, description, uploaderIp, "attachment");
    }

    /**
     * 여러 파일을 한 번에 업로드 (fileUsage 지정)
     */
    @Transactional
    public List<AttachmentDto> uploadFiles(String pgmId, String refId, List<MultipartFile> files,
            String description, String uploaderIp, String fileUsage) {
        if (files == null || files.isEmpty()) {
            return List.of();
        }

        List<AttachmentDto> results = new ArrayList<>();
        for (MultipartFile file : files) {
            try {
                AttachmentDto dto = uploadFile(pgmId, refId, file, description, uploaderIp, fileUsage);
                results.add(dto);
            } catch (Exception e) {
                log.error("파일 업로드 실패: {}", file.getOriginalFilename(), e);
                // 필요에 따라 예외를 다시 던질지 결정 (여기서는 무시하고 계속 진행)
            }
        }
        return results;
    }

    /**
     * 파일 단건 조회
     */
    public AttachmentDto getFile(Long fileId) {
        return attachmentMapper.selectFile(fileId);
    }

    /**
     * 파일 목록 조회 (기본: file_usage='attachment'만)
     */
    public List<AttachmentDto> getFileList(String pgmId, String refId) {
        return attachmentMapper.selectFileList(pgmId, refId);
    }

    /**
     * 파일 목록 조회 (fileUsage 필터)
     */
    public List<AttachmentDto> getFileListByUsage(String pgmId, String refId, String fileUsage) {
        return attachmentMapper.selectFileListByUsage(pgmId, refId, fileUsage);
    }

    /**
     * 파일 단건 소프트 삭제
     */
    @Transactional
    public boolean softDeleteFile(Long fileId) {
        return attachmentMapper.softDeleteFile(fileId) > 0;
    }

    /**
     * pgmId + refId 기준 전체 소프트 삭제
     */
    @Transactional
    public boolean softDeleteFilesByRef(String pgmId, String refId) {
        return attachmentMapper.softDeleteFilesByRef(pgmId, refId) > 0;
    }
}