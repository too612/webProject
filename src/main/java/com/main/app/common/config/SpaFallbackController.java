package com.main.app.common.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaFallbackController {

    @GetMapping({
            "/",
            "/official", "/official/{path:[^\\.]*}", "/official/{path:[^\\.]*}/**",
            "/about", "/about/{path:[^\\.]*}", "/about/{path:[^\\.]*}/**",
            "/worship", "/worship/{path:[^\\.]*}", "/worship/{path:[^\\.]*}/**",
            "/ministries", "/ministries/{path:[^\\.]*}", "/ministries/{path:[^\\.]*}/**",
            "/news", "/news/{path:[^\\.]*}", "/news/{path:[^\\.]*}/**",
            "/support", "/support/{path:[^\\.]*}", "/support/{path:[^\\.]*}/**",
            "/auth", "/auth/{path:[^\\.]*}", "/auth/{path:[^\\.]*}/**",
            "/community", "/community/{path:[^\\.]*}", "/community/{path:[^\\.]*}/**",
            "/erp", "/erp/{path:[^\\.]*}", "/erp/{path:[^\\.]*}/**",
            "/mypage", "/mypage/{path:[^\\.]*}", "/mypage/{path:[^\\.]*}/**",
            "/system", "/system/{path:[^\\.]*}", "/system/{path:[^\\.]*}/**"
    })
    public String spaPath() {
        return "forward:/index.html";
    }
}