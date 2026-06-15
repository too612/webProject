package com.main.app.official.worship.sermons;

import java.io.ByteArrayOutputStream;
import java.net.MalformedURLException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.main.app.common.dto.ApiResponse;
import com.main.app.common.comment.dto.CommentDto;
import com.main.app.common.file.dto.FileDto;
import com.main.app.official.worship.sermons.dto.SermonDto;
import com.main.app.official.worship.sermons.dto.SermonRequest;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/official/worship/sermons")
public class SermonController {

    private static final String BASE_PATH = "/worship/sermons";
    private static final String VIEW_HISTORY_SESSION_KEY = "sermonViewHistory";
    private static final long VIEW_COUNT_COOLDOWN_MILLIS = 3000L;

    private final SermonService sermonService;

    public SermonController(SermonService sermonService) {
        this.sermonService = sermonService;
    }

    @GetMapping
    public ApiResponse<Page<SermonDto>> list(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "searchType", required = false) String searchType,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "worshipType", required = false) String worshipType) {
        Pageable pageable = PageRequest.of(page, 10);
        Page<SermonDto> paging = sermonService.getBoardList(pageable, searchType, keyword, worshipType);
        return ApiResponse.ok(paging);
    }

    @GetMapping("/write")
    public ApiResponse<SermonDto> writeForm(@RequestParam(name = "rqstNo", required = false) String rqstNo) {
        if (rqstNo != null) {
            SermonDto board = sermonService.getBoardDetail(rqstNo, false);
            return ApiResponse.ok(board);
        }

        SermonDto board = new SermonDto();
        board.setBoardType("SERMONS");
        return ApiResponse.ok(board);
    }

    @GetMapping("/reply")
    public ApiResponse<SermonDto> replyForm(@RequestParam(name = "parentNo") String parentNo) {
        SermonDto parent = sermonService.getBoardDetail(parentNo, false);
        SermonDto reply = new SermonDto();
        reply.setParentNo(parentNo);
        reply.setTitle(parent.getTitle());
        reply.setBoardType("SERMONS");
        return ApiResponse.ok(reply);
    }

    @PostMapping("/write")
    public ApiResponse<Map<String, String>> save(SermonRequest request) {
        if (request.getOrderNo() == null) {
            request.setOrderNo(0);
        }
        if (request.getDepth() == null) {
            request.setDepth(0);
        }
        sermonService.saveBoard(request);

        // 프론트엔드에서 파일 업로드 시 rqstNo 가 필요하므로 반환
        Map<String, String> payload = new HashMap<>();
        payload.put("basePath", BASE_PATH);
        payload.put("rqstNo", request.getRqstNo() == null ? "" : String.valueOf(request.getRqstNo()));
        return ApiResponse.ok(payload, "게시글이 등록되었습니다.");
    }

    @PostMapping("/update")
    public ApiResponse<Map<String, String>> update(SermonRequest request) {
        sermonService.updateBoard(request);

        Map<String, String> payload = new HashMap<>();
        payload.put("rqstNo", request.getRqstNo() == null ? "" : String.valueOf(request.getRqstNo()));
        return ApiResponse.ok(payload, "게시글이 수정되었습니다.");
    }

    @PostMapping("/delete")
    public ApiResponse<Map<String, String>> delete(@RequestParam(name = "rqstNo") String rqstNo) {
        sermonService.deleteBoard(rqstNo);

        Map<String, String> payload = new HashMap<>();
        payload.put("rqstNo", rqstNo);
        return ApiResponse.ok(payload, "게시글이 삭제되었습니다.");
    }

    @GetMapping("/view")
    public ApiResponse<Map<String, Object>> view(
            @RequestParam(name = "rqstNo") String rqstNo,
            HttpSession session) {
        @SuppressWarnings("unchecked")
        Map<String, Long> viewHistory = (Map<String, Long>) session.getAttribute(VIEW_HISTORY_SESSION_KEY);
        if (viewHistory == null) {
            viewHistory = new HashMap<>();
            session.setAttribute(VIEW_HISTORY_SESSION_KEY, viewHistory);
        }

        long now = System.currentTimeMillis();
        Long lastViewedAt = viewHistory.get(rqstNo);
        boolean increaseViewCount = lastViewedAt == null || (now - lastViewedAt) >= VIEW_COUNT_COOLDOWN_MILLIS;

        SermonDto board = sermonService.getBoardDetail(rqstNo, increaseViewCount);
        viewHistory.put(rqstNo, now);
        List<CommentDto> comments = sermonService.getCommentList(rqstNo);

        @SuppressWarnings("unchecked")
        Map<Long, String> voteHistory = (Map<Long, String>) session.getAttribute("voteHistory");
        if (voteHistory == null) {
            voteHistory = new HashMap<>();
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("board", board);
        payload.put("comments", comments);
        payload.put("commentCount", comments.size());
        payload.put("userVotes", voteHistory);
        return ApiResponse.ok(payload);
    }

    @PostMapping("/view")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkPasswordAndView(
            @RequestParam(name = "rqstNo") String rqstNo,
            @RequestParam(name = "password") String password) {
        SermonDto board = sermonService.getBoardDetail(rqstNo, false);
        if (board == null || !sermonService.isValidPassword(rqstNo, password)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.fail(HttpStatus.BAD_REQUEST.value(), "비밀번호가 일치하지 않습니다."));
        }

        List<CommentDto> comments = sermonService.getCommentList(rqstNo);
        Map<String, Object> payload = new HashMap<>();
        payload.put("board", board);
        payload.put("comments", comments);
        payload.put("commentCount", comments.size());
        return ResponseEntity.ok(ApiResponse.ok(payload));
    }

    /**
     * 단건 파일 다운로드
     * GET /api/official/worship/sermons/download?fileId={fileId}
     */
    @GetMapping("/download")
    public ResponseEntity<Resource> download(@RequestParam("fileId") Long fileId) throws MalformedURLException {
        FileDto file = sermonService.getFile(fileId);
        if (file == null) {
            return ResponseEntity.notFound().build();
        }
        UrlResource resource = new UrlResource("file:" + file.getFilePath());
        String originalFileName = Objects.requireNonNullElse(file.getOrgFileNm(), "download");
        String encodedFileName = URLEncoder.encode(originalFileName, StandardCharsets.UTF_8)
                .replaceAll("\\+", "%20");
        String contentDisposition = "attachment; filename*=UTF-8''" + encodedFileName;

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    /**
     * 전체 파일 ZIP 다운로드
     * GET /api/official/worship/sermons/downloadZip?rqstNo={rqstNo}
     * - rqstNo(sermonId) 기준으로 official_sermon_file 에서 파일 목록 조회
     * - filePath(절대경로) 기준으로 파일을 읽어 ZIP 으로 묶어 반환
     * - 파일이 1개인 경우에도 동작 (프론트에서 2개 이상일 때만 버튼 노출)
     * - ZIP 내 파일명 중복 방지: {fileId}_{원본파일명}
     */
    @GetMapping("/downloadZip")
    public ResponseEntity<byte[]> downloadZip(@RequestParam("rqstNo") String rqstNo) {
        List<FileDto> files = sermonService.getFileList(rqstNo);

        if (files == null || files.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             ZipOutputStream zos = new ZipOutputStream(baos, StandardCharsets.UTF_8)) {

            for (FileDto file : files) {
                if (file.getFilePath() == null) continue;

                java.nio.file.Path path = Paths.get(file.getFilePath());
                if (!Files.exists(path)) continue;

                // ZIP 내 파일명 중복 방지
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

    @PostMapping("/comment/write")
    public ApiResponse<Map<String, Object>> writeComment(CommentDto comment) {
        sermonService.saveComment(comment);

        Map<String, Object> payload = new HashMap<>();
        payload.put("boardNo", comment.getRefId());
        return ApiResponse.ok(payload, "댓글이 등록되었습니다.");
    }

    @PostMapping("/comment/vote")
    public ApiResponse<Map<String, Object>> likeComment(
            @RequestBody Map<String, String> payload,
            HttpSession session) {
        Long commentId = Long.parseLong(payload.get("commentId"));
        String action = payload.get("action");

        @SuppressWarnings("unchecked")
        Map<Long, String> voteHistory = (Map<Long, String>) session.getAttribute("voteHistory");
        if (voteHistory == null) {
            voteHistory = new HashMap<>();
            session.setAttribute("voteHistory", voteHistory);
        }

        String previousVote = voteHistory.get(commentId);
        sermonService.handleVote(commentId, action, previousVote);

        if (action.equals(previousVote)) {
            voteHistory.remove(commentId);
        } else {
            voteHistory.put(commentId, action);
        }

        CommentDto updatedComment = sermonService.getComment(commentId);
        Map<String, Object> response = new HashMap<>();
        response.put("likes", updatedComment.getLikes());
        response.put("dislikes", updatedComment.getDislikes());
        response.put("userVote", voteHistory.get(commentId));

        return ApiResponse.ok(response);
    }
}
