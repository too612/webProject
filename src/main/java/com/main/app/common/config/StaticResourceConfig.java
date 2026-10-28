package com.main.app.common.config;

import java.io.IOException;
import java.util.Locale;
import java.util.Set;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

/**
 * 업로드 파일(/data/**) 정적 서빙 설정.
 * <p>
 * 공개 사이트(교역자 소개, 갤러리 등)가 /data/** 이미지를 직접 사용하므로 경로는 열어 두되,
 * 업로드 문서(PDF·오피스·압축 파일)가 무인증 URL 로 내려가지 않도록 이미지 확장자만 노출한다.
 * 문서는 인증이 필요한 다운로드 API 를 통해서만 받을 수 있다.
 */
@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    private static final Set<String> PUBLIC_IMAGE_EXTENSIONS = Set.of(
            "jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "ico");

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/data/**")
                .addResourceLocations("file:./data/")
                .resourceChain(true)
                .addResolver(new PublicImageResourceResolver());
    }

    /**
     * 이미지 확장자가 아닌 리소스는 존재하더라도 404 로 응답한다.
     */
    private static class PublicImageResourceResolver extends PathResourceResolver {

        @Override
        protected Resource getResource(String resourcePath, Resource location) throws IOException {
            Resource resource = super.getResource(resourcePath, location);
            if (resource == null) {
                return null;
            }
            return isPublicImageFileName(resource.getFilename()) ? resource : null;
        }
    }

    /**
     * 파일명이 공개해도 되는 이미지 확장자인지 확인한다.
     * <p>
     * 문서(PDF·오피스·압축)는 무인증 URL 로 노출하지 않고, 인증이 필요한 다운로드 API 로만 제공한다.
     */
    static boolean isPublicImageFileName(String filename) {
        if (filename == null) {
            return false;
        }

        int extensionIndex = filename.lastIndexOf('.');
        if (extensionIndex < 0) {
            return false;
        }

        String extension = filename.substring(extensionIndex + 1).toLowerCase(Locale.ROOT);
        return PUBLIC_IMAGE_EXTENSIONS.contains(extension);
    }
}
