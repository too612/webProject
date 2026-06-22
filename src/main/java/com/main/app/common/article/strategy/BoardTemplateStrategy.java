package com.main.app.common.article.strategy;

import com.main.app.common.article.dto.ArticleDto;
import com.main.app.common.article.dto.ArticleRequest;

public interface BoardTemplateStrategy {
    default void validate(ArticleRequest request) {}
    default void afterLoad(ArticleDto post) {}
}