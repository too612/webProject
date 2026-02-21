package com.main.app.community.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.view.RedirectView;

@Controller
@RequestMapping
public class CommunityLegacyRedirectController {

    private static final String COMMUNITY_PREFIX = "/community";

    @GetMapping({
            "/group", "/group/**",
            "/facilities", "/facilities/**",
            "/saint", "/saint/**",
            "/world", "/world/**",
            "/board", "/board/**"
    })
    public RedirectView redirectLegacyGet(HttpServletRequest request) {
        String target = buildTargetUrl(request);
        RedirectView view = new RedirectView(target, true);
        view.setStatusCode(HttpStatus.MOVED_PERMANENTLY);
        return view;
    }

    @PostMapping({
            "/group", "/group/**",
            "/facilities", "/facilities/**",
            "/saint", "/saint/**",
            "/world", "/world/**",
            "/board", "/board/**"
    })
    public String forwardLegacyPost(HttpServletRequest request) {
        String target = COMMUNITY_PREFIX + request.getRequestURI();
        String query = request.getQueryString();
        if (query != null && !query.isEmpty()) {
            target = target + "?" + query;
        }
        return "forward:" + target;
    }

    private String buildTargetUrl(HttpServletRequest request) {
        String target = COMMUNITY_PREFIX + request.getRequestURI();
        String query = request.getQueryString();
        if (query != null && !query.isEmpty()) {
            target = target + "?" + query;
        }
        return target;
    }
}
