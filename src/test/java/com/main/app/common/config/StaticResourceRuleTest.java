package com.main.app.common.config;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

/**
 * /data/** 정적 리소스 노출 규칙 테스트.
 * <p>
 * 공개 사이트가 사용하는 이미지는 그대로 서빙하되, 업로드 문서(PDF·오피스·압축)는 무인증 URL 로 내려가지 않아야 한다.
 */
class StaticResourceRuleTest {

    @Test
    void imageFilesArePublic() {
        assertThat(StaticResourceConfig.isPublicImageFileName("profile.png")).isTrue();
        assertThat(StaticResourceConfig.isPublicImageFileName("history-01.JPG")).isTrue();
        assertThat(StaticResourceConfig.isPublicImageFileName("photo.jpeg")).isTrue();
        assertThat(StaticResourceConfig.isPublicImageFileName("logo.svg")).isTrue();
        assertThat(StaticResourceConfig.isPublicImageFileName("icon.WebP")).isTrue();
    }

    @Test
    void documentsAreNotPublic() {
        assertThat(StaticResourceConfig.isPublicImageFileName("contract.pdf")).isFalse();
        assertThat(StaticResourceConfig.isPublicImageFileName("budget.xlsx")).isFalse();
        assertThat(StaticResourceConfig.isPublicImageFileName("notice.docx")).isFalse();
        assertThat(StaticResourceConfig.isPublicImageFileName("backup.zip")).isFalse();
        assertThat(StaticResourceConfig.isPublicImageFileName("script.js")).isFalse();
    }

    @Test
    void filesWithoutExtensionAreNotPublic() {
        assertThat(StaticResourceConfig.isPublicImageFileName("README")).isFalse();
        assertThat(StaticResourceConfig.isPublicImageFileName(".env")).isFalse();
        assertThat(StaticResourceConfig.isPublicImageFileName(null)).isFalse();
    }
}
