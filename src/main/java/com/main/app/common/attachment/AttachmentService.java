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
import java.util.Set;
import java.util.UUID;

import org.springframework.dao.DataAccessException;
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

    /**
     * 비로그인 사용자에게도 공개되는 첨부 도메인.
     * <p>
     * official 은 공개 홈페이지이므로 게시글(post)·설교(sermon)·연혁(history)·교역자(pastor) 첨부는 로그인 없이
     * 내려받을 수 있어야 한다. ERP/시스템 등 그 외 도메인의 첨부는 공개 대상이 아니므로 인증이 필요하다.
     */
    private static final Set<String> PUBLIC_PGM_IDS = Set.of("post", "sermon", "history", "pastor");
    private static final String POST_PGM_ID = "post";
    private static final String SERMON_PGM_ID = "sermon";
    private static final String EDITOR_USAGE = "editor";
    private static final String ATTACHMENT_USAGE = "attachment";

    public AttachmentService(AttachmentMapper attachmentMapper) {
        this.attachmentMapper = attachmentMapper;
    }

    /**
     * 비로그인 사용자에게 내려도 되는 파일인지 판별한다.
     * <p>
     * - 공개 도메인({@link #PUBLIC_PGM_IDS})이 아니면 공개하지 않는다.
     * - 게시글(post)·설교(sermon) 첨부는 비밀글·삭제된 원본의 첨부를 공개하지 않는다.
     */
    public boolean isPubliclyDownloadable(AttachmentDto file) {
        if (file == null || file.getPgmId() == null) {
            return false;
        }
        if (!PUBLIC_PGM_IDS.contains(file.getPgmId())) {
            return false;
        }
        return isPublicRef(file.getPgmId(), file.getRefId(), file.getFileUsage());
    }

    /**
     * 비로그인 사용자에게 pgmId + refId 그룹(파일 목록·ZIP·댓글)을 공개해도 되는지 판별한다.
     */
    public boolean isPubliclyDownloadableGroup(String pgmId, String refId) {
        if (pgmId == null || !PUBLIC_PGM_IDS.contains(pgmId)) {
            return false;
        }
        return isPublicRef(pgmId, refId, ATTACHMENT_USAGE);
    }

    /**
     * 공개 도메인 내 원본(게시글·설교) 참조가 공개 대상인지 판별한다.
     */
    private boolean isPublicRef(String pgmId, String refId, String fileUsage) {
        if (POST_PGM_ID.equals(pgmId)) {
            return isPublicPostRef(refId, fileUsage);
        }
        if (SERMON_PGM_ID.equals(pgmId)) {
            return isPublicSermonRef(refId, fileUsage);
        }
        // history·pastor 는 별도 비밀글 개념이 없다.
        return true;
    }

    /**
     * 게시글 참조 공개 여부. 저장 전 업로드분(refId='temp')은 editor 용도만 공개한다.
     */
    private boolean isPublicPostRef(String refId, String fileUsage) {
        if (!isNumeric(refId)) {
            return isEditorUpload(fileUsage);
        }
        return Boolean.FALSE.equals(attachmentMapper.selectPostSecretFlag(refId));
    }

    /**
     * 설교 참조 공개 여부. 저장 전 업로드분(refId='temp')은 editor 용도만 공개한다.
     * <p>
     * official_sermon 테이블이 없는 구 스키마 환경에서도 비로그인 다운로드가 500 으로 깨지지 않도록,
     * 조회 실패 시에는 공개하지 않는 쪽( fail-closed )으로 처리한다.
     */
    private boolean isPublicSermonRef(String refId, String fileUsage) {
        if (!isNumeric(refId)) {
            return isEditorUpload(fileUsage);
        }
        try {
            return Boolean.FALSE.equals(attachmentMapper.selectSermonSecretFlag(refId));
        } catch (DataAccessException exception) {
            log.warn("[Attachment] 설교 공개 여부 조회에 실패하여 비공개로 처리합니다. refId={}", refId, exception);
            return false;
        }
    }

    /**
     * 원본 저장 전 업로드된 파일인지 확인한다.
     * file_usage 가 NULL 로 남은 과거 데이터가 있어 함께 허용한다.
     */
    private static boolean isEditorUpload(String fileUsage) {
        return fileUsage == null || EDITOR_USAGE.equals(fileUsage);
    }

    private static boolean isNumeric(String value) {
        if (!StringUtils.hasText(value)) {
            return false;
        }
        for (int i = 0; i < value.length(); i++) {
            if (!Character.isDigit(value.charAt(i))) {
                return false;
            }
        }
        return true;
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