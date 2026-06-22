package com.main.app.common.article.strategy;

import com.main.app.common.article.dto.ArticleDto;
import com.main.app.common.article.dto.ArticleRequest;
import org.springframework.stereotype.Component;

@Component("SERMON")
public class SermonTemplateStrategy implements BoardTemplateStrategy {

    @Override
    public void validate(ArticleRequest request) {
        String metadata = request.getMetadata();
        if (metadata == null || metadata.isEmpty()) {
            throw new RuntimeException("설교 정보(metadata)는 필수 입력값입니다.");
        }

        // 간단한 문자열 포함 여부 검증 (JSON 파싱 없음)
        if (!metadata.contains("\"preacher\"") || !metadata.contains("\"scripture\"")) {
            throw new RuntimeException("설교자(preacher)와 성경본문(scripture)은 필수 입력값입니다.");
        }
    }

    @Override
    public void afterLoad(ArticleDto post) {
        // 추가 후처리 로직 (필요 시)
    }
}