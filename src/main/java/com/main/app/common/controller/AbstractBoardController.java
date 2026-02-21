package com.main.app.common.controller;

import java.net.MalformedURLException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.util.UriUtils;

import com.main.app.common.dto.BoardDto;
import com.main.app.common.dto.CommentDto;
import com.main.app.common.dto.FileDto;
import com.main.app.common.dto.MenuDto;
import com.main.app.common.helper.BoardContext;
import com.main.app.common.service.BoardService;
import com.main.app.common.service.MenuService;

import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.HttpServletRequest;

public abstract class AbstractBoardController {

    @Autowired
    protected BoardService boardService;

    @Autowired
    protected MenuService menuService;

    protected abstract BoardContext getBoardContext();

    @ModelAttribute
    public void addAttributes(Model model, HttpServletRequest request) {
        model.addAttribute("submenu", "Y");

        // URI에서 systemType 추출
        String uri = request.getRequestURI();
        String systemType = extractSystemType(uri);

        List<MenuDto> menus = menuService.getHierarchicalMenus(systemType);
        BoardContext context = getBoardContext();
        String targetPath = context.getTargetMenuPath();
        String legacyTargetPath = targetPath;
        if (targetPath.startsWith("/community")) {
            legacyTargetPath = targetPath.substring("/community".length());
            if (legacyTargetPath.isEmpty()) {
                legacyTargetPath = "/";
            }
        }
        String activePath = context.getBasePath();

        for (MenuDto topMenu : menus) {
            List<MenuDto> subMenus = topMenu.getSubMenus();
            if (subMenus != null) {
                for (MenuDto sub : subMenus) {
                        boolean matchesTarget = targetPath.equals(sub.getPath())
                            || legacyTargetPath.equals(sub.getPath());
                        if (matchesTarget) {
                        model.addAttribute("currentMenu", topMenu.getMenuName());
                        model.addAttribute("currentSubmenu", sub.getMenuName());

                        for (MenuDto s : subMenus) {
                            boolean isActive = targetPath.equals(s.getPath())
                                || legacyTargetPath.equals(s.getPath());
                            s.setActive(isActive);
                            if (isActive) s.setPath(activePath);
                        }
                        model.addAttribute("currentSubMenus", subMenus);
                        return;
                    }
                }
            }
        }
    }

    @GetMapping
    public String list(Model model,
                       @RequestParam(name = "page", defaultValue = "0") int page,
                       @RequestParam(name = "searchType", required = false) String searchType,
                       @RequestParam(name = "keyword", required = false) String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        Page<BoardDto> paging = boardService.getBoardList(pageable, searchType, keyword, getBoardContext().getBoardType());
        model.addAttribute("boards", paging.getContent());
        model.addAttribute("paging", paging);
        return getBoardContext().getListView();
    }

    @GetMapping("/write")
    public String writeForm(Model model, @RequestParam(name = "rqstNo", required = false) String rqstNo) {
        if (rqstNo != null) {
            BoardDto board = boardService.getBoardDetail(rqstNo, getBoardContext().getBoardType());
            model.addAttribute("board", board);
        } else {
            BoardDto board = new BoardDto();
            board.setBoardType(getBoardContext().getBoardType());
            model.addAttribute("board", board);
        }
        return getBoardContext().getWriteView();
    }

    @GetMapping("/reply")
    public String replyForm(Model model, @RequestParam(name = "parentNo") String parentNo) {
        BoardDto parent = boardService.getBoardDetail(parentNo, getBoardContext().getBoardType());
        BoardDto reply = new BoardDto();
        reply.setParentNo(parentNo);
        reply.setTitle("RE: " + parent.getTitle());
        reply.setBoardType(getBoardContext().getBoardType());
        model.addAttribute("board", reply);
        return getBoardContext().getWriteView();
    }

    @PostMapping("/write")
    public String save(BoardDto board, @RequestParam(name = "files", required = false) List<MultipartFile> files) {
        if (board.getOrderNo() == null) board.setOrderNo(0);
        if (board.getDepth() == null) board.setDepth(0);
        board.setBoardType(getBoardContext().getBoardType());
        boardService.saveBoard(board, files);
        return "redirect:" + getBoardContext().getBasePath();
    }

    @PostMapping("/update")
    public String update(BoardDto board, @RequestParam(name = "files", required = false) List<MultipartFile> files) {
        board.setBoardType(getBoardContext().getBoardType());
        boardService.updateBoard(board, files);
        return "redirect:" + getBoardContext().getBasePath() + "/view?rqstNo=" + board.getRqstNo();
    }

    @PostMapping("/delete")
    public String delete(@RequestParam(name = "rqstNo") String rqstNo) {
        boardService.deleteBoard(rqstNo);
        return "redirect:" + getBoardContext().getBasePath();
    }

    @GetMapping("/view")
    public String view(Model model, @RequestParam(name = "rqstNo") String rqstNo, HttpSession session) {
        BoardDto board = boardService.getBoardDetail(rqstNo, getBoardContext().getBoardType());
        List<CommentDto> comments = boardService.getCommentList(rqstNo);

        @SuppressWarnings("unchecked")
        Map<Long, String> voteHistory = (Map<Long, String>) session.getAttribute("voteHistory");
        if (voteHistory == null) voteHistory = new HashMap<>();

        model.addAttribute("board", board);
        model.addAttribute("comments", comments);
        model.addAttribute("commentCount", comments.size());
        model.addAttribute("userVotes", voteHistory);
        return getBoardContext().getViewView();
    }

    @PostMapping("/view")
    public String checkPasswordAndView(Model model,
                                       @RequestParam(name = "rqstNo") String rqstNo,
                                       @RequestParam(name = "password") String password,
                                       RedirectAttributes redirectAttributes) {
        BoardDto board = boardService.getBoardDetail(rqstNo, getBoardContext().getBoardType());
        if (board == null || !password.equals(board.getPassword())) {
            redirectAttributes.addFlashAttribute("message", "비밀번호가 일치하지 않습니다.");
            return "redirect:" + getBoardContext().getBasePath();
        }
        List<CommentDto> comments = boardService.getCommentList(rqstNo);
        model.addAttribute("board", board);
        model.addAttribute("comments", comments);
        model.addAttribute("commentCount", comments.size());
        return getBoardContext().getViewView();
    }

    @GetMapping("/download")
    public ResponseEntity<Resource> download(@RequestParam("fileId") Long fileId) throws MalformedURLException {
        FileDto file = boardService.getFile(fileId);
        UrlResource resource = new UrlResource("file:" + file.getFilePath());
        String originalFileName = Objects.requireNonNullElse(file.getOrgFileNm(), "download");
        String encodedUploadFileName = UriUtils.encode(originalFileName, StandardCharsets.UTF_8);
        String contentDisposition = "attachment; filename=\"" + encodedUploadFileName + "\"";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                .body(resource);
    }

    @PostMapping("/comment/write")
    public String writeComment(CommentDto comment) {
        boardService.saveComment(comment);
        return "redirect:" + getBoardContext().getBasePath() + "/view?rqstNo=" + comment.getBoardNo();
    }

    @PostMapping("/comment/vote")
    @ResponseBody
    public Map<String, Object> likeComment(@RequestBody Map<String, String> payload, HttpSession session) {
        Long commentId = Long.parseLong(payload.get("commentId"));
        String action = payload.get("action");

        @SuppressWarnings("unchecked")
        Map<Long, String> voteHistory = (Map<Long, String>) session.getAttribute("voteHistory");
        if (voteHistory == null) {
            voteHistory = new HashMap<>();
            session.setAttribute("voteHistory", voteHistory);
        }

        String previousVote = voteHistory.get(commentId);
        boardService.handleVote(commentId, action, previousVote);

        if (action.equals(previousVote)) {
            voteHistory.remove(commentId);
        } else {
            voteHistory.put(commentId, action);
        }

        CommentDto updatedComment = boardService.getComment(commentId);
        Map<String, Object> response = new HashMap<>();
        response.put("likes", updatedComment.getLikes());
        response.put("dislikes", updatedComment.getDislikes());
        response.put("userVote", voteHistory.get(commentId));

        return response;
    }

    /**
     * URI에서 systemType을 추출합니다.
     * @param uri 현재 요청 URI
     * @return systemType (official, erp, community) 또는 official (기본값)
     */
    private String extractSystemType(String uri) {
        if (uri == null || uri.isEmpty()) {
            return "official";
        }
        
        if (uri.startsWith("/official")) {
            return "official";
        } else if (uri.startsWith("/erp")) {
            return "erp";
        } else if (uri.startsWith("/community")) {
            return "community";
        }
        
        return "official";
    }
}
