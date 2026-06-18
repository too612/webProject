package com.main.app.official.about.pastor.dto;

import com.main.app.common.attachment.dto.AttachmentDto;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.List;

@Data
public class PastorDto {
    private Long corpId;
    private String corpName;
    private String businessRegistrationNumber;
    private String chiefName;
    private String phoneNumber;
    private String postalCode;
    private String addressLine1;
    private String addressLine2;
    private String introduction;
    private OffsetDateTime updatedAt;
    private List<AttachmentDto> fileList;
}
