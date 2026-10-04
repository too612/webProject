package com.main.app.common.excel;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.ByteArrayInputStream;
import java.io.IOException;

@Component
public class ExcelRequestLimitFilter extends OncePerRequestFilter {
    private final int maxBytes;
    public ExcelRequestLimitFilter(@Value("${app.excel.max-request-bytes:10485760}") int maxBytes) {
        if (maxBytes <= 0 || maxBytes == Integer.MAX_VALUE) throw new IllegalArgumentException("엑셀 요청 제한이 올바르지 않습니다.");
        this.maxBytes = maxBytes;
    }
    @Override protected boolean shouldNotFilter(HttpServletRequest request) {
        return !"POST".equals(request.getMethod()) || !"/api/common/excel/download".equals(request.getServletPath());
    }
    @Override protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
        if (request.getContentLengthLong() > maxBytes) { reject(response); return; }
        byte[] body = request.getInputStream().readNBytes(maxBytes + 1);
        if (body.length > maxBytes) { reject(response); return; }
        chain.doFilter(new HttpServletRequestWrapper(request) {
            @Override public ServletInputStream getInputStream() {
                var input = new ByteArrayInputStream(body);
                return new ServletInputStream() {
                    @Override public boolean isFinished() { return input.available() == 0; }
                    @Override public boolean isReady() { return true; }
                    @Override public void setReadListener(ReadListener listener) { throw new IllegalStateException("엑셀 요청은 동기 방식으로 읽어야 합니다."); }
                    @Override public int read() { return input.read(); }
                    @Override public int read(byte[] bytes, int off, int len) { return input.read(bytes, off, len); }
                };
            }
        }, response);
    }
    private void reject(HttpServletResponse response) throws IOException {
        response.setStatus(413);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"success\":false,\"statusCode\":413,\"message\":\"엑셀 요청 본문 용량 제한을 초과했습니다.\",\"data\":null}");
    }
}