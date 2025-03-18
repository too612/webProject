package com.main.app.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Board {
    private Long id;
    private String title;
    private String content;
    private String author;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String category;
    private Integer viewCount;
    private String status;
}
