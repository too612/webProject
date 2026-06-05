package com.main.app.official.worship.sermons;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.main.app.common.dto.CommentDto;
import com.main.app.common.file.dto.FileDto;
import com.main.app.common.util.PaginationUtil;
import com.main.app.official.worship.sermons.dto.SermonDto;
import com.main.app.official.worship.sermons.dto.SermonRequest;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class SermonService {

    private final SermonMapper sermonMapper;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.upload.path:./data/}")
    private String uploadBasePath;

    public SermonService(SermonMapper sermonMapper, PasswordEncoder passwordEncoder) {
        this.sermonMapper = sermonMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public Page<SermonDto> getBoardList(Pageable pageable, String searchType, String keyword, String worshipType) {
        Map<String, Object> params = new HashMap<>();
        params.put("searchType", searchType);
        params.put("keyword", keyword);
        params.put("worshipType", worshipType);
        params.put("size", pageable.getPageSize());
        params.put("offset", pageable.getOffset());

        List<SermonDto> list = sermonMapper.selectBoardList(params);
        long total = sermonMapper.countBoardList(params);
        return PaginationUtil.toPage(list, pageable, total);
    }

    @Transactional
    public SermonDto getBoardDetail(String rqstNo, boolean increaseViewCount) {
        Long sermonId = parseSermonId(rqstNo);
        if (sermonId == null) {
            return null;
        }

        Map<String, Object> params = new HashMap<>();
        params.put("rqstNo", sermonId);

        if (increaseViewCount) {
            sermonMapper.updateReadCount(params);
        }

        SermonDto board = sermonMapper.selectBoardDetail(params);
        if (board != null) {
            board.setFileList(sermonMapper.selectFileList(sermonId));
        }
        return board;
    }

    @Transactional
    public void saveBoard(SermonRequest request, List<MultipartFile> files) {
        normalizeRequest(request);

        if (request.getRqstNo() == null) {
            sermonMapper.insertBoard(request);
        } else {
            sermonMapper.updateBoard(request);
        }

        processFiles(request.getRqstNo(), files);
    }

    @Transactional
    public void updateBoard(SermonRequest request, List<MultipartFile> files) {
        normalizeRequest(request);
        sermonMapper.updateBoard(request);

        if (request.getDeletedFileIds() != null) {
            request.getDeletedFileIds().forEach(sermonMapper::softDeleteFileById);
        }

        processFiles(request.getRqstNo(), files);
    }

    @Transactional
    public void deleteBoard(String rqstNo) {
        Long sermonId = parseSermonId(rqstNo);
        if (sermonId == null) {
            return;
        }
        sermonMapper.softDeleteComments(sermonId);
        sermonMapper.softDeleteFiles(sermonId);
        sermonMapper.softDeleteBoard(sermonId);
    }

    public FileDto getFile(Long fileId) {
        return sermonMapper.selectFile(fileId);
    }

    public List<CommentDto> getCommentList(String boardNo) {
        if (parseSermonId(boardNo) == null) {
            return List.of();
        }
        return sermonMapper.selectCommentList(boardNo);
    }

    public void saveComment(CommentDto comment) {
        if (comment.getSecret() == null) {
            comment.setSecret("N");
        }
        if (comment.getSpoiler() == null) {
            comment.setSpoiler("N");
        }
        if (StringUtils.hasText(comment.getPassword())) {
            comment.setPassword(passwordEncoder.encode(comment.getPassword()));
        }
        sermonMapper.insertComment(comment);
    }

    public CommentDto getComment(Long commentId) {
        return sermonMapper.selectCommentById(commentId.intValue());
    }

    public void handleVote(Long commentId, String action, String previousVote) {
        int id = commentId.intValue();
        if (previousVote == null) {
            if ("like".equals(action)) {
                sermonMapper.increaseLike(id);
            } else {
                sermonMapper.increaseDislike(id);
            }
            return;
        }

        if (previousVote.equals(action)) {
            if ("like".equals(action)) {
                sermonMapper.decreaseLike(id);
            } else {
                sermonMapper.decreaseDislike(id);
            }
            return;
        }

        if ("like".equals(action)) {
            sermonMapper.decreaseDislike(id);
            sermonMapper.increaseLike(id);
        } else {
            sermonMapper.decreaseLike(id);
            sermonMapper.increaseDislike(id);
        }
    }

    public boolean isValidPassword(String rqstNo, String rawPassword) {
        if (!StringUtils.hasText(rawPassword)) {
            return false;
        }
        Map<String, Object> params = new HashMap<>();
        params.put("rqstNo", parseSermonId(rqstNo));
        SermonDto board = sermonMapper.selectBoardDetail(params);
        if (board == null || !StringUtils.hasText(board.getPassword())) {
            return false;
        }
        return passwordEncoder.matches(rawPassword, board.getPassword());
    }

    private void normalizeRequest(SermonRequest request) {
        if (!StringUtils.hasText(request.getPassword())) {
            request.setPassword(null);
            return;
        }
        if (isBcryptHash(request.getPassword())) {
            return;
        }
        request.setPassword(passwordEncoder.encode(request.getPassword()));
    }

    private boolean isBcryptHash(String value) {
        return StringUtils.hasText(value) && value.matches("^\\$2[aby]\\$.{56}$");
    }

    private void processFiles(Long sermonId, List<MultipartFile> files) {
        if (sermonId == null || files == null || files.isEmpty()) {
            return;
        }

        LocalDate now = LocalDate.now();
        String year = String.format("%04d", now.getYear());
        String mmdd = String.format("%02d%02d", now.getMonthValue(), now.getDayOfMonth());
        String category = "sermon";
        String relativeDir = "data/" + category + "/" + year + "/" + mmdd;
        Path physicalDir = resolveUploadBasePath().resolve(category).resolve(year).resolve(mmdd);

        for (MultipartFile file : files) {
            if (file == null || file.isEmpty()) {
                continue;
            }

            try {
                String originalName = StringUtils.hasText(file.getOriginalFilename())
                        ? file.getOriginalFilename()
                        : "unknown";
                String storedName = java.util.UUID.randomUUID() + "_" + originalName;

                Files.createDirectories(physicalDir);
                Path destination = physicalDir.resolve(storedName).toAbsolutePath().normalize();
                file.transferTo(destination);

                FileDto fileDto = new FileDto();
                fileDto.setBoardNo(String.valueOf(sermonId));
                fileDto.setOrgFileNm(originalName);
                fileDto.setStoredFileNm(storedName);
                fileDto.setFileSize(file.getSize());
                fileDto.setFilePath(destination.toString());
                fileDto.setRelativePath(destination.toString());
                fileDto.setFileExt(extractExtension(originalName));
                fileDto.setMimeType(file.getContentType());
                fileDto.setFileCategory(category);
                fileDto.setRelativeDir(relativeDir);

                sermonMapper.insertFile(fileDto);
            } catch (Exception ex) {
                log.error("Failed to upload sermon attachment: sermonId={}, originalName={}",
                        sermonId,
                        file.getOriginalFilename(),
                        ex);
                throw new IllegalStateException("첨부파일 저장 중 오류가 발생했습니다.", ex);
            }
        }
    }

    private Long parseSermonId(String rqstNo) {
        if (!StringUtils.hasText(rqstNo)) {
            return null;
        }
        try {
            return Long.parseLong(rqstNo);
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    private String extractExtension(String fileName) {
        int index = fileName.lastIndexOf('.');
        if (index < 0 || index == fileName.length() - 1) {
            return "";
        }
        return fileName.substring(index + 1).toLowerCase();
    }

    private Path resolveUploadBasePath() {
        Path base = Paths.get(uploadBasePath);
        if (!base.isAbsolute()) {
            base = Paths.get(System.getProperty("user.dir")).resolve(base);
        }
        return base.toAbsolutePath().normalize();
    }
}
