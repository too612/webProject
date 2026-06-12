package com.main.app.common.file;

import java.io.ByteArrayOutputStream;
import java.net.MalformedURLException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.springframework.beans.factory.annotation.Value;
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

import com.main.app.common.dto.ApiResponse;
import com.main.app.common.file.dto.FileDto;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/common/files")
public class FileController {

    private final FileService fileService;

    @Value("${app.upload.path:./data/}")
    private String uploadBasePath;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<Void>> uploadFiles(
            @RequestParam("boardNo") String boardNo,
            @RequestParam(value = "fileCategory", required = false) String fileCategory,
            @RequestParam(value = "menuKey", required = false) String menuKey,
            @RequestParam("files") List<MultipartFile> files,
            HttpServletRequest request) {
        fileService.uploadFiles(boardNo, files, fileCategory, menuKey, null, request.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.ok(null, "파일이 업로드되었습니다."));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FileDto>>> getFileList(@RequestParam("boardNo") String boardNo) {
        return ResponseEntity.ok(ApiResponse.ok(fileService.getFileList(boardNo)));
    }

    @GetMapping("/{fileId}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable("fileId") Long fileId) {
        FileDto file = fileService.getFile(fileId);
        if (file == null) {
            return ResponseEntity.notFound().build();
        }

        Path path = resolvePhysicalPath(file);
        if (path == null || !Files.exists(path)) {
            return ResponseEntity.notFound().build();
        }

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
     * 게시글에 첨부된 파일 전체를 ZIP으로 묶어 다운로드한다.
     * URL: GET /api/common/files/getInfoZip?boardNo={boardNo}
     * 프론트엔드의 buildZipUrl: `/api/common/files/getInfoZip?boardNo=${rqstNo}`
     */
    @GetMapping("/getInfoZip")
    public ResponseEntity<byte[]> downloadZip(@RequestParam("boardNo") String boardNo) {
        List<FileDto> files = fileService.getFileList(boardNo);

        if (files == null || files.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
                ZipOutputStream zos = new ZipOutputStream(baos)) {

            for (FileDto file : files) {
                Path path = resolvePhysicalPath(file);
                if (path == null || !Files.exists(path)) {
                    continue; // 물리 파일이 없으면 건너뜀
                }

                // ZIP 내 파일명 중복 방지: fileId_원본파일명
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

    @DeleteMapping("/{fileId}")
    public ResponseEntity<ApiResponse<Void>> deleteFile(@PathVariable("fileId") Long fileId) {
        boolean deleted = fileService.softDeleteFile(fileId);
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.fail(HttpStatus.NOT_FOUND.value(), "파일을 찾을 수 없습니다."));
        }

        return ResponseEntity.ok(ApiResponse.ok(null, "파일이 삭제되었습니다."));
    }

    private Path resolvePhysicalPath(FileDto file) {
        if (StringUtils.hasText(file.getFilePath())) {
            Path legacyPath = Paths.get(file.getFilePath());
            if (Files.exists(legacyPath)) {
                return legacyPath;
            }
        }

        if (!StringUtils.hasText(file.getRelativePath())) {
            return null;
        }

        String normalizedRelative = file.getRelativePath().replace("\\", "/");
        if (normalizedRelative.startsWith("data/")) {
            normalizedRelative = normalizedRelative.substring("data/".length());
        }

        return Paths.get(uploadBasePath, normalizedRelative);
    }
}
