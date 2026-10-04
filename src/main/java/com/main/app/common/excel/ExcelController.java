package com.main.app.common.excel;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.server.ResponseStatusException;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;

@Controller
public class ExcelController {
    private final ExcelService service;
    public ExcelController(ExcelService service) { this.service = service; }
    public static HttpSession authenticatedSession(HttpServletRequest request) {
        var session = request.getSession(false);
        if (session == null || !(session.getAttribute("userId") instanceof String id) || id.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인 후 엑셀을 다운로드하세요.");
        }
        return session;
    }
    @PostMapping("/api/common/excel/download")
    public void download(@RequestBody ExcelModel.Request body, HttpServletRequest request, HttpServletResponse response) throws IOException {
        var file = service.generate(body, authenticatedSession(request));
        try {
            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.setHeader("Content-Disposition", ContentDisposition.attachment().filename(ExcelService.fileName(body.fileName()), StandardCharsets.UTF_8).build().toString());
            response.setHeader("Cache-Control", "no-store");
            response.setContentLengthLong(Files.size(file));
            Files.copy(file, response.getOutputStream());
        } finally { Files.deleteIfExists(file); }
    }
}