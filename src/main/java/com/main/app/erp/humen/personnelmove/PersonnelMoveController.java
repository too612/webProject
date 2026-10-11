package com.main.app.erp.humen.personnelmove;

import com.main.app.common.dto.ApiResponse;
import com.main.app.common.excel.ExcelController;
import com.main.app.erp.humen.personnelmove.dto.PersonnelMoveDto.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController("erpHumenPersonnelMoveController")
@RequestMapping("/api/erp/humen/personnelmove")
@RequiredArgsConstructor
public class PersonnelMoveController {
    private final PersonnelMoveService personnelMoveService;
    private final PersonnelMoveExcelDataProvider excelDataProvider;

    @GetMapping(params = "!excelSnapshot")
    public ApiResponse<Page<Assignment>> list(@ModelAttribute ListQuery query) {
        return ApiResponse.ok(personnelMoveService.getPersonnelMoveList(query));
    }

    @GetMapping(params = "excelSnapshot")
    public ApiResponse<Page<Assignment>> listWithSnapshot(@ModelAttribute ListQuery query,
            @RequestParam boolean excelSnapshot, HttpServletRequest request, HttpServletResponse response) {
        var session = excelSnapshot ? ExcelController.authenticatedSession(request) : null;
        var page = personnelMoveService.getPersonnelMoveList(query);
        if (session != null) {
            response.setHeader("Cache-Control", "no-store");
            response.setHeader("X-Excel-Snapshot", excelDataProvider.issue(session, query, page));
        }
        return ApiResponse.ok(page);
    }

    @GetMapping("/options")
    public ApiResponse<Options> options() { return ApiResponse.ok(personnelMoveService.getOptions()); }

    @GetMapping("/employees")
    public ApiResponse<Page<Person>> employees(@RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "50") int size) {
        return ApiResponse.ok(personnelMoveService.getEmployees(keyword, page, size));
    }

    @GetMapping("/concurrent")
    public ApiResponse<List<Person>> concurrent(@RequestParam String personKey) {
        return ApiResponse.ok(personnelMoveService.getConcurrent(personKey));
    }

    @PostMapping("/concurrent")
    public ApiResponse<Person> setCreateConcurrent(@RequestBody ConcurrentRequest body, HttpServletRequest request) {
        return ApiResponse.ok(personnelMoveService.setCreateConcurrent(body, audit(request)));
    }

    @GetMapping("/{assignmentKey}")
    public ApiResponse<Assignment> getInfo(@PathVariable String assignmentKey) {
        return ApiResponse.ok(personnelMoveService.getInfo(assignmentKey));
    }

    @PostMapping
    public ApiResponse<Assignment> setCreate(@RequestBody Assignment body, HttpServletRequest request) {
        Assignment saved = personnelMoveService.setCreate(body, audit(request));
        return ApiResponse.ok(saved, saved.isSyncPaused() ? "발령 저장 완료 (동기화 일시정지: 적용 대기)" : "발령 저장 완료");
    }

    @PutMapping("/{assignmentKey}")
    public ApiResponse<Assignment> setUpdate(@PathVariable String assignmentKey, @RequestBody Assignment body,
            HttpServletRequest request) {
        Assignment saved = personnelMoveService.setUpdate(assignmentKey, body, audit(request));
        return ApiResponse.ok(saved, saved.isSyncPaused() ? "발령 수정 완료 (동기화 일시정지: 적용 대기)" : "발령 수정 완료");
    }

    @DeleteMapping("/{assignmentKey}")
    public ApiResponse<Void> delRemove(@PathVariable String assignmentKey, @RequestParam long version,
            @RequestParam(defaultValue = "false") boolean historicalEdit,
            @RequestParam(required = false) String historicalReason, HttpServletRequest request) {
        personnelMoveService.delRemove(assignmentKey, version, historicalEdit, historicalReason, audit(request));
        return ApiResponse.ok(null, "발령 삭제 완료");
    }

    @ExceptionHandler({org.springframework.validation.BindException.class,
            org.springframework.web.method.annotation.MethodArgumentTypeMismatchException.class,
            org.springframework.http.converter.HttpMessageNotReadableException.class})
    public org.springframework.http.ResponseEntity<ApiResponse<Void>> invalidRequest(Exception exception) {
        return org.springframework.http.ResponseEntity.badRequest()
                .body(ApiResponse.fail(400, "입력 형식이 올바르지 않습니다. 날짜는 유효한 yyyy-MM-dd 형식이어야 합니다."));
    }

    private static Audit audit(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || !(session.getAttribute("userId") instanceof String userId) || userId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }
        return new Audit(userId, request.getRemoteAddr());
    }
}
