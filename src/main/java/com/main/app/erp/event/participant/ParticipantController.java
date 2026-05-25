package com.main.app.erp.event.participant;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.event.participant.dto.ParticipantDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("erpEventParticipantController")
@RequestMapping("/api/erp/event/participant")
@RequiredArgsConstructor
public class ParticipantController {

    private final ParticipantService participantService;

    @GetMapping
    public ApiResponse<Page<ParticipantDto.Participant>> getParticipantList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(participantService.getParticipantList(page, keyword));
    }
}