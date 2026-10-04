package com.main.app.erp.humen.manager;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.humen.manager.dto.ManagerDto;
import com.main.app.erp.humen.manager.dto.ManagerRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.main.app.common.excel.ExcelController;

@RestController("erpHumenManagerController")
@RequestMapping("/api/erp/humen/manager")
@RequiredArgsConstructor
public class ManagerController {

    private final ManagerService managerService;
    private final ManagerExcelDataProvider excelDataProvider;

    @GetMapping(params = "!excelSnapshot")
    public ApiResponse<Page<ManagerDto.Person>> list(
            @ModelAttribute ManagerDto.ListQuery query) {
        return ApiResponse.ok(managerService.getPersonList(query));
    }

    @GetMapping(params = "excelSnapshot")
    public ApiResponse<Page<ManagerDto.Person>> listWithSnapshot(
            @ModelAttribute ManagerDto.ListQuery query, @RequestParam boolean excelSnapshot,
            HttpServletRequest request, HttpServletResponse response) {
        var session = excelSnapshot ? ExcelController.authenticatedSession(request) : null;
        var page = managerService.getPersonList(query);
        if (session != null) {
            response.setHeader("Cache-Control", "no-store");
            response.setHeader("X-Excel-Snapshot", excelDataProvider.issue(session, query, page));
        }
        return ApiResponse.ok(page);
    }

    @GetMapping("/options")
    public ApiResponse<ManagerDto.FilterOptions> options() {
        return ApiResponse.ok(managerService.getFilterOptions());
    }

    @GetMapping("/{employeeNo}")
    public ApiResponse<ManagerDto.PersonDetail> detail(@PathVariable("employeeNo") String employeeNo) {
        return ApiResponse.ok(managerService.getPersonDetail(employeeNo));
    }

    @PostMapping
    public ApiResponse<Void> create(@RequestBody ManagerRequest request) {
        managerService.createPerson(request);
        return ApiResponse.ok(null, "인사정보를 등록했습니다.");
    }
}
