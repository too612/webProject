package com.main.app.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers( ResourceHandlerRegistry registry) {
        /* '/js/**'로 호출하는 자원은 '/static/js/' 폴더 아래에서 찾는다. */ 
        registry.addResourceHandler("/js/**").addResourceLocations("classpath:/static/js/").setCachePeriod(60 * 60 * 24 * 365); 
        /* '/css/**'로 호출하는 자원은 '/static/css/' 폴더 아래에서 찾는다. */ 
        registry.addResourceHandler("/css/**").addResourceLocations("classpath:/static/css/").setCachePeriod(60 * 60 * 24 * 365); 
        /* '/images/**'로 호출하는 자원은 '/static/images/' 폴더 아래에서 찾는다. */ 
        registry.addResourceHandler("/images/**").addResourceLocations("classpath:/static/images/").setCachePeriod(60 * 60 * 24 * 365); 
        /* '/font/**'로 호출하는 자원은 '/static/fonts/' 폴더 아래에서 찾는다. */ 
        registry.addResourceHandler("/fonts/**").addResourceLocations("classpath:/static/fonts/").setCachePeriod(60 * 60 * 24 * 365); 
        /* '/scss/**'로 호출하는 자원은 '/static/scss/' 폴더 아래에서 찾는다. */ 
        registry.addResourceHandler("/scss/**").addResourceLocations("classpath:/static/scss/").setCachePeriod(60 * 60 * 24 * 365); 
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 필요한 인터셉터가 있다면 여기에 추가
    }
}
