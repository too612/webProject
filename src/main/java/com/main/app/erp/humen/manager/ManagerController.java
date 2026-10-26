package com.main.app.erp.humen.manager;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.humen.manager.dto.ManagerDto;
import com.main.app.erp.humen.manager.dto.ManagerRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
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

    @PutMapping("/{personKey}/basic-info")
    public ApiResponse<ManagerDto.PersonDetail> setUpdate(@PathVariable("personKey") String personKey,
            @RequestBody ManagerDto.BasicInfoUpdate body, HttpServletRequest request) {
        return ApiResponse.ok(managerService.setUpdate(personKey, body, audit(request)), "기본 정보를 저장했습니다.");
    }

    @PutMapping(value = "/{personKey}/profile-photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<ManagerDto.ProfilePhoto> setUpdateProfilePhoto(@PathVariable("personKey") String personKey,
            @RequestPart("file") MultipartFile file, HttpServletRequest request) {
        return ApiResponse.ok(managerService.setUpdateProfilePhoto(personKey, file, audit(request)),
                "프로필 사진을 적용했습니다.");
    }

    @DeleteMapping("/{personKey}/profile-photo")
    public ApiResponse<ManagerDto.ProfilePhoto> delRemoveProfilePhoto(@PathVariable("personKey") String personKey,
            HttpServletRequest request) {
        return ApiResponse.ok(managerService.delRemoveProfilePhoto(personKey, audit(request)),
                "프로필 사진을 삭제했습니다.");
    }

    private static ManagerDto.Audit audit(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || !(session.getAttribute("userId") instanceof String userId) || userId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }
        return new ManagerDto.Audit(userId, request.getRemoteAddr());
    }
}
