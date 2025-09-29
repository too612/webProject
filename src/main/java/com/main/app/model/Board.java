package com.main.app.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Board {
    private String rqstNo;
    private String privRqstNo;
    private String title;
    private String cont;
    private String rqstId;
    private LocalDateTime insDt;
    private LocalDateTime uptDt;
}
