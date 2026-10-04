package com.main.app.erp.humen.personnelmove;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.humen.personnelmove.dto.PersonnelMoveDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("erpHumenPersonnelMoveController")
@RequestMapping("/api/erp/humen/personnelmove")
@RequiredArgsConstructor
public class PersonnelMoveController {

    private final PersonnelMoveService personnelMoveService;

    @GetMapping
    public ApiResponse<Page<PersonnelMoveDto.PersonnelMove>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(personnelMoveService.getPersonnelMoveList(page, keyword));
    }
}
