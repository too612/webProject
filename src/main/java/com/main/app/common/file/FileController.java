package com.main.app.common.file;

import java.io.ByteArrayOutputStream;
import java.net.MalformedURLException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;

import com.main.app.common.dto.ApiResponse;
import com.main.app.common.file.dto.FileDto;

@RestController
@RequestMapping("/api/common/files")
public class FileController {

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    /**
     * 단건 파일 업로드
     * POST /api/common/files/upload
     * - pgmId, refId, fileUsage 를 받아 com_file 에 저장
     * - fileUsage 기본값: 'attachment'
     * - 프론트엔드 attachmentApi.upload() 에서 호출
     */
    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<FileDto>> uploadFile(
            @RequestParam("pgmId") String pgmId,
            @RequestParam("refId") String refId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "fileUsage", defaultValue = "attachment") String fileUsage, // ★ 추가
            HttpServletRequest request) {

        FileDto saved = fileService.uploadFile(pgmId, refId, file, null, request.getRemoteAddr(), fileUsage);
        return ResponseEntity.ok(ApiResponse.ok(saved, "파일이 업로드되었습니다."));
    }

    /**
     * pgmId + refId 기준 파일 목록 조회 (기본: attachment만)
     * GET /api/common/files?pgmId={pgmId}&refId={refId}
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<FileDto>>> getFileList(
            @RequestParam("pgmId") String pgmId,
            @RequestParam("refId") String refId) {
        return ResponseEntity.ok(ApiResponse.ok(fileService.getFileList(pgmId, refId)));
    }

    /**
     * pgmId + refId + fileUsage 기준 파일 목록 조회 (선택)
     * GET /api/common/files/list?pgmId={pgmId}&refId={refId}&fileUsage={fileUsage}
     */
    @GetMapping("/list")
    public ResponseEntity<ApiResponse<List<FileDto>>> getFileListByUsage(
            @RequestParam("pgmId") String pgmId,
            @RequestParam("refId") String refId,
            @RequestParam("fileUsage") String fileUsage) {
        return ResponseEntity.ok(ApiResponse.ok(fileService.getFileListByUsage(pgmId, refId, fileUsage)));
    }

    /**
     * 파일 단건 다운로드
     * GET /api/common/files/{fileId}/download
     */
    @GetMapping("/{fileId}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable("fileId") Long fileId) {
        FileDto file = fileService.getFile(fileId);
        if (file == null)
            return ResponseEntity.notFound().build();

        if (!StringUtils.hasText(file.getFilePath()))
            return ResponseEntity.notFound().build();

        java.nio.file.Path path = Paths.get(file.getFilePath());
        if (!Files.exists(path))
            return ResponseEntity.notFound().build();

        try {
            Resource resource = new UrlResource(path.toUri());
            String encodedFileName = URLEncoder.encode(file.getOrgFileNm(), StandardCharsets.UTF_8)
                    .replaceAll("\\+", "%20");
            String disposition = "attachment; filename*=UTF-8''" + encodedFileName;

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, disposition)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(resource);
        } catch (MalformedURLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * pgmId + refId 기준 전체 파일 ZIP 다운로드
     * GET /api/common/files/downloadZip?pgmId={pgmId}&refId={refId}
     */
    @GetMapping("/downloadZip")
    public ResponseEntity<byte[]> downloadZip(
            @RequestParam("pgmId") String pgmId,
            @RequestParam("refId") String refId) {
        List<FileDto> files = fileService.getFileList(pgmId, refId);

        if (files == null || files.isEmpty())
            return ResponseEntity.notFound().build();

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
                ZipOutputStream zos = new ZipOutputStream(baos, StandardCharsets.UTF_8)) {

            for (FileDto file : files) {
                if (!StringUtils.hasText(file.getFilePath()))
                    continue;
                java.nio.file.Path path = Paths.get(file.getFilePath());
                if (!Files.exists(path))
                    continue;

                String entryName = file.getFileId() + "_" + file.getOrgFileNm();
                zos.putNextEntry(new ZipEntry(entryName));
                Files.copy(path, zos);
                zos.closeEntry();
            }

            zos.finish();
            byte[] zipBytes = baos.toByteArray();

            String encodedFileName = URLEncoder.encode("download.zip", StandardCharsets.UTF_8)
                    .replaceAll("\\+", "%20");
            String disposition = "attachment; filename*=UTF-8''" + encodedFileName;

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, disposition)
                    .header(HttpHeaders.CONTENT_LENGTH, String.valueOf(zipBytes.length))
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(zipBytes);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 파일 단건 소프트 삭제
     * DELETE /api/common/files/{fileId}
     */
    @DeleteMapping("/{fileId}")
    public ResponseEntity<ApiResponse<Void>> deleteFile(@PathVariable("fileId") Long fileId) {
        boolean deleted = fileService.softDeleteFile(fileId);
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.fail(HttpStatus.NOT_FOUND.value(), "파일을 찾을 수 없습니다."));
        }
        return ResponseEntity.ok(ApiResponse.ok(null, "파일이 삭제되었습니다."));
    }
}