package com.main.app.common.file;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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

    /**
     * 파일 업로드 및 com_file 등록
     *
     * @param pgmId      프로그램 구분 (sermon, pastor, qna ...)
     * @param refId      참조 ID (게시글 번호, 신청번호 등)
     * @param files      업로드 파일 목록
     * @param uploaderId 업로더 ID
     * @param uploaderIp 업로더 IP
     */
    @Transactional
    public void uploadFiles(String pgmId,
                            String refId,
                            List<MultipartFile> files,
                            String uploaderId,
                            String uploaderIp) {
        if (files == null || files.isEmpty()) return;

        // 저장 디렉토리: {uploadBasePath}/{pgmId}/YYYY/MMDD
        java.time.LocalDate now = java.time.LocalDate.now();
        String year = String.format("%04d", now.getYear());
        String mmdd = String.format("%02d%02d", now.getMonthValue(), now.getDayOfMonth());

        Path physicalDir = resolveUploadBasePath()
                .resolve(pgmId)
                .resolve(year)
                .resolve(mmdd);
        String relativeDir = pgmId + "/" + year + "/" + mmdd;

        for (MultipartFile file : files) {
            if (file == null || file.isEmpty()) continue;

            try {
                String originalName = StringUtils.hasText(file.getOriginalFilename())
                        ? file.getOriginalFilename() : "unknown";
                String storedName = UUID.randomUUID() + "_" + originalName;

                Files.createDirectories(physicalDir);
                Path destination = physicalDir.resolve(storedName).toAbsolutePath().normalize();
                file.transferTo(destination);

                FileDto fileDto = new FileDto();
                fileDto.setPgmId(pgmId);
                fileDto.setRefId(refId);
                fileDto.setOrgFileNm(originalName);
                fileDto.setStoredFileNm(storedName);
                fileDto.setFilePath(destination.toString());
                fileDto.setRelativePath(relativeDir + "/" + storedName);
                fileDto.setFileExt(extractExtension(originalName));
                fileDto.setMimeType(file.getContentType());
                fileDto.setFileSize(file.getSize());
                fileDto.setSortOrder(0);
                fileDto.setUploaderId(uploaderId);
                fileDto.setUploaderIp(uploaderIp);

                fileMapper.insertFile(fileDto);

            } catch (Exception e) {
                log.error("File upload failed: pgmId={}, refId={}, originalName={}",
                        pgmId, refId, file.getOriginalFilename(), e);
                throw new IllegalStateException("첨부파일 저장 중 오류가 발생했습니다.", e);
            }
        }
    }

    /**
     * 단건 파일 업로드 — FileController.uploadFile() 에서 호출
     * 저장 후 fileId 가 채워진 FileDto 반환
     */
    @Transactional
    public FileDto uploadFile(String pgmId, String refId, MultipartFile file,
                              String uploaderId, String uploaderIp) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("업로드할 파일이 없습니다.");
        }

        java.time.LocalDate now = java.time.LocalDate.now();
        String year = String.format("%04d", now.getYear());
        String mmdd = String.format("%02d%02d", now.getMonthValue(), now.getDayOfMonth());

        Path physicalDir = resolveUploadBasePath().resolve(pgmId).resolve(year).resolve(mmdd);
        String relativeDir = pgmId + "/" + year + "/" + mmdd;

        try {
            String originalName = StringUtils.hasText(file.getOriginalFilename())
                    ? file.getOriginalFilename() : "unknown";
            String storedName = UUID.randomUUID() + "_" + originalName;

            Files.createDirectories(physicalDir);
            Path destination = physicalDir.resolve(storedName).toAbsolutePath().normalize();
            file.transferTo(destination);

            FileDto fileDto = new FileDto();
            fileDto.setPgmId(pgmId);
            fileDto.setRefId(refId);
            fileDto.setOrgFileNm(originalName);
            fileDto.setStoredFileNm(storedName);
            fileDto.setFilePath(destination.toString());
            fileDto.setRelativePath(relativeDir + "/" + storedName);
            fileDto.setFileExt(extractExtension(originalName));
            fileDto.setMimeType(file.getContentType());
            fileDto.setFileSize(file.getSize());
            fileDto.setSortOrder(0);
            fileDto.setUploaderId(uploaderId);
            fileDto.setUploaderIp(uploaderIp);

            fileMapper.insertFile(fileDto);
            return fileDto;

        } catch (Exception e) {
            log.error("File upload failed: pgmId={}, refId={}, originalName={}",
                    pgmId, refId, file.getOriginalFilename(), e);
            throw new IllegalStateException("첨부파일 저장 중 오류가 발생했습니다.", e);
        }
    }

    /** 파일 단건 조회 */
    public FileDto getFile(Long fileId) {
        return fileMapper.selectFile(fileId);
    }

    /** pgmId + refId 기준 파일 목록 조회 */
    public List<FileDto> getFileList(String pgmId, String refId) {
        return fileMapper.selectFileList(pgmId, refId);
    }

    /** 파일 단건 소프트 삭제 */
    @Transactional
    public boolean softDeleteFile(Long fileId) {
        return fileMapper.softDeleteFile(fileId) > 0;
    }

    /** pgmId + refId 기준 전체 소프트 삭제 */
    @Transactional
    public int softDeleteFilesByRef(String pgmId, String refId) {
        return fileMapper.softDeleteFilesByRef(pgmId, refId);
    }

    private String extractExtension(String fileName) {
        if (!StringUtils.hasText(fileName)) return "";
        int idx = fileName.lastIndexOf('.');
        if (idx < 0 || idx == fileName.length() - 1) return "";
        return fileName.substring(idx + 1).toLowerCase();
    }

    private Path resolveUploadBasePath() {
        Path base = Paths.get(uploadBasePath);
        if (!base.isAbsolute()) {
            base = Paths.get(System.getProperty("user.dir")).resolve(base);
        }
        return base.toAbsolutePath().normalize();
    }
}
