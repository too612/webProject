package com.main.app.controller;

import java.net.MalformedURLException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.util.UriUtils;

import com.main.app.model.BoardDto;
import com.main.app.model.CommentDto;
import com.main.app.model.FileDto;
import com.main.app.model.MenuDto;
import com.main.app.service.BoardService;
import com.main.app.service.MenuService;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/board")
public class BoardController {

    @Autowired
    private BoardService boardService;

    @Autowired
    private MenuService menuService;

    @ModelAttribute
    public void addAttributes(Model model) {
        model.addAttribute("submenu", "Y");

        // URL 변경(/support/qna -> /board)으로 인해 메뉴 자동 매핑이 안될 경우를 대비해
        // MenuService를 통해 메뉴 목록을 가져와서 수동으로 활성화 처리
        List<MenuDto> menus = menuService.getHierarchicalMenus();
        String targetPath = "/support/qna"; // DB에 저장된 게시판 경로

        for (MenuDto topMenu : menus) {
            List<MenuDto> subMenus = topMenu.getSubMenus();
            if (subMenus != null) {
                for (MenuDto sub : subMenus) {
                    if (targetPath.equals(sub.getPath())) {
                        model.addAttribute("currentMenu", topMenu.getMenuName());
                        model.addAttribute("currentSubmenu", sub.getMenuName());
                        
                        for (MenuDto s : subMenus) {
                            boolean isActive = targetPath.equals(s.getPath());
                            s.setActive(isActive);
                            if (isActive) s.setPath("/board");
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
        Page<BoardDto> paging = boardService.getBoardList(pageable, searchType, keyword);
        model.addAttribute("boards", paging.getContent());
        model.addAttribute("paging", paging);
        return "support/qna"; // 뷰 파일 경로는 기존 유지 (추후 templates/board/list.html 등으로 이동 권장)
    }

    @GetMapping("/write")
    public String writeForm(Model model, @RequestParam(name = "rqstNo", required = false) String rqstNo) {
        if (rqstNo != null) {
            BoardDto board = boardService.getBoardDetail(rqstNo);
            model.addAttribute("board", board);
        } else {
            model.addAttribute("board", new BoardDto());
        }
        return "support/qnaWrite";
    }

    @GetMapping("/reply")
    public String replyForm(Model model, @RequestParam(name = "parentNo") String parentNo) {
        BoardDto parent = boardService.getBoardDetail(parentNo);
        BoardDto reply = new BoardDto();
        reply.setParentNo(parentNo);
        reply.setTitle("RE: " + parent.getTitle());
        model.addAttribute("board", reply);
        return "support/qnaWrite";
    }

    @PostMapping("/write")
    public String save(BoardDto board, @RequestParam(name = "files", required = false) List<MultipartFile> files) {
        if (board.getOrderNo() == null) board.setOrderNo(0);
        if (board.getDepth() == null) board.setDepth(0);
        boardService.saveBoard(board, files);
        return "redirect:/board";
    }

    @PostMapping("/update")
    public String update(BoardDto board, @RequestParam(name = "files", required = false) List<MultipartFile> files) {
        boardService.updateBoard(board, files);
        return "redirect:/board/view?rqstNo=" + board.getRqstNo();
    }

    @PostMapping("/delete")
    public String delete(@RequestParam(name = "rqstNo") String rqstNo) {
        boardService.deleteBoard(rqstNo);
        return "redirect:/board";
    }

    @GetMapping("/view")
    public String view(Model model, @RequestParam(name = "rqstNo") String rqstNo, HttpSession session) {
        BoardDto board = boardService.getBoardDetail(rqstNo);
        List<CommentDto> comments = boardService.getCommentList(rqstNo);
        
        @SuppressWarnings("unchecked")
        Map<Long, String> voteHistory = (Map<Long, String>) session.getAttribute("voteHistory");
        if (voteHistory == null) voteHistory = new HashMap<>();
        
        model.addAttribute("board", board);
        model.addAttribute("comments", comments);
        model.addAttribute("commentCount", comments.size());
        model.addAttribute("userVotes", voteHistory);
        return "support/qnaView";
    }

    @PostMapping("/view")
    public String checkPasswordAndView(Model model, 
                                       @RequestParam(name = "rqstNo") String rqstNo,
                                       @RequestParam(name = "password") String password,
                                       RedirectAttributes redirectAttributes) {
        BoardDto board = boardService.getBoardDetail(rqstNo);
        if (board == null || !password.equals(board.getPassword())) {
            redirectAttributes.addFlashAttribute("message", "비밀번호가 일치하지 않습니다.");
            return "redirect:/board";
        }
        List<CommentDto> comments = boardService.getCommentList(rqstNo);
        model.addAttribute("board", board);
        model.addAttribute("comments", comments);
        model.addAttribute("commentCount", comments.size());
        return "support/qnaView";
    }

    @GetMapping("/download")
    public ResponseEntity<Resource> download(@RequestParam("fileId") Long fileId) throws MalformedURLException {
        FileDto file = boardService.getFile(fileId);
        UrlResource resource = new UrlResource("file:" + file.getFilePath());
        String encodedUploadFileName = UriUtils.encode(file.getOrgFileNm(), StandardCharsets.UTF_8);
        String contentDisposition = "attachment; filename=\"" + encodedUploadFileName + "\"";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                .body(resource);
    }
    
    @PostMapping("/comment/write")
    public String writeComment(CommentDto comment) {
        boardService.saveComment(comment);
        return "redirect:/board/view?rqstNo=" + comment.getBoardNo();
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
}