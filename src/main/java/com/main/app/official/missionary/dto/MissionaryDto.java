package com.main.app.official.missionary.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MissionaryDto {
    private String employeeNo;
    private String personKey;
    private String name;
    private String country;
    private String countryCode;
    private LocalDate dispatchedDate;
    private LocalDate dispatchDate;
    private String assignmentContent;
    private String groupKey;

    public LocalDate getDispatchDate() {
        return dispatchDate != null ? dispatchDate : dispatchedDate;
    }

    public LocalDate getDispatchedDate() {
        return dispatchedDate != null ? dispatchedDate : dispatchDate;
    }
}
