package com.main.app.common.article.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrevNextDto {
    private Long prevId;
    private Long nextId;
    private String prevTitle;
    private String nextTitle;
}