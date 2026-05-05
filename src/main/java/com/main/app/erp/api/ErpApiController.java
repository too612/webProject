package com.main.app.erp.api;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.main.app.common.dto.ApiResponse;
import com.main.app.common.dto.PageMetaDto;

@RestController
@RequestMapping("/api/erp")
public class ErpApiController {

        @GetMapping("/pages")
        public ApiResponse<Map<String, List<PageMetaDto>>> getPages() {
                return ApiResponse.ok(Map.of(
                                "humen", List.of(
                                                new PageMetaDto("성도관리", "/erp/humen/manager", "erp",
                                                                "erp/humen/manager"),
                                                new PageMetaDto("교구관리", "/erp/humen/district", "erp",
                                                                "erp/humen/district"),
                                                new PageMetaDto("새가족관리", "/erp/humen/newcomer", "erp",
                                                                "erp/humen/newcomer"),
                                                new PageMetaDto("변동관리", "/erp/humen/change", "erp",
                                                                "erp/humen/change")),
                                "sermon", List.of(
                                                new PageMetaDto("설교관리", "/erp/sermon/manager", "erp",
                                                                "erp/sermon/manager"),
                                                new PageMetaDto("설교아카이브", "/erp/sermon/archive", "erp",
                                                                "erp/sermon/archive"),
                                                new PageMetaDto("출석관리", "/erp/sermon/attendance", "erp",
                                                                "erp/sermon/attendance"),
                                                new PageMetaDto("설교작성", "/erp/sermon/write", "erp", "erp/sermon/write"),
                                                new PageMetaDto("예배순서", "/erp/sermon/order", "erp",
                                                                "erp/sermon/order")),
                                "account", List.of(
                                                new PageMetaDto("회계관리", "/erp/account/manager", "erp",
                                                                "erp/account/manager"),
                                                new PageMetaDto("수입입력", "/erp/account/input", "erp",
                                                                "erp/account/input"),
                                                new PageMetaDto("예산관리", "/erp/account/budget", "erp",
                                                                "erp/account/budget"),
                                                new PageMetaDto("지출관리", "/erp/account/expense", "erp",
                                                                "erp/account/expense"),
                                                new PageMetaDto("재정보고", "/erp/account/report", "erp",
                                                                "erp/account/report")),
                                "training", List.of(
                                                new PageMetaDto("과정관리", "/erp/training/course", "erp",
                                                                "erp/training/course"),
                                                new PageMetaDto("수강생관리", "/erp/training/student", "erp",
                                                                "erp/training/student"),
                                                new PageMetaDto("교육출결", "/erp/training/attendance", "erp",
                                                                "erp/training/attendance"),
                                                new PageMetaDto("수료관리", "/erp/training/complete", "erp",
                                                                "erp/training/complete")),
                                "ministry", List.of(
                                                new PageMetaDto("부서관리", "/erp/ministry/department", "erp",
                                                                "erp/ministry/department"),
                                                new PageMetaDto("사역일정", "/erp/ministry/schedule", "erp",
                                                                "erp/ministry/schedule"),
                                                new PageMetaDto("봉사자관리", "/erp/ministry/volunteer", "erp",
                                                                "erp/ministry/volunteer"),
                                                new PageMetaDto("사역보고", "/erp/ministry/report", "erp",
                                                                "erp/ministry/report"))));
        }

        @GetMapping("/pages/extended")
        public ApiResponse<Map<String, List<PageMetaDto>>> getPagesExtended() {
                return ApiResponse.ok(Map.of(
                                "event", List.of(
                                                new PageMetaDto("행사캘린더", "/erp/event/calendar", "erp",
                                                                "erp/event/calendar"),
                                                new PageMetaDto("행사신청", "/erp/event/apply", "erp", "erp/event/apply"),
                                                new PageMetaDto("참가자관리", "/erp/event/participant", "erp",
                                                                "erp/event/participant"),
                                                new PageMetaDto("행사결과", "/erp/event/result", "erp",
                                                                "erp/event/result")),
                                "facility", List.of(
                                                new PageMetaDto("시설예약", "/erp/facility/reservation", "erp",
                                                                "erp/facility/reservation"),
                                                new PageMetaDto("차량관리", "/erp/facility/vehicle", "erp",
                                                                "erp/facility/vehicle"),
                                                new PageMetaDto("비품관리", "/erp/facility/inventory", "erp",
                                                                "erp/facility/inventory"),
                                                new PageMetaDto("시설점검", "/erp/facility/maintenance", "erp",
                                                                "erp/facility/maintenance")),
                                "comm", List.of(
                                                new PageMetaDto("공지관리", "/erp/comm/notice", "erp", "erp/comm/notice"),
                                                new PageMetaDto("메시지관리", "/erp/comm/message", "erp",
                                                                "erp/comm/message"),
                                                new PageMetaDto("기도요청", "/erp/comm/prayer", "erp", "erp/comm/prayer"),
                                                new PageMetaDto("뉴스레터", "/erp/comm/newsletter", "erp",
                                                                "erp/comm/newsletter")),
                                "stats", List.of(
                                                new PageMetaDto("대시보드", "/erp/stats/dashboard", "erp",
                                                                "erp/stats/dashboard"),
                                                new PageMetaDto("출석통계", "/erp/stats/attendance", "erp",
                                                                "erp/stats/attendance"),
                                                new PageMetaDto("헌금통계", "/erp/stats/offering", "erp",
                                                                "erp/stats/offering"),
                                                new PageMetaDto("사역통계", "/erp/stats/ministry", "erp",
                                                                "erp/stats/ministry")),
                                "admin", List.of(
                                                new PageMetaDto("증명서발급", "/erp/admin/certificate", "erp",
                                                                "erp/admin/certificate"),
                                                new PageMetaDto("결재관리", "/erp/admin/approval", "erp",
                                                                "erp/admin/approval"),
                                                new PageMetaDto("회의록", "/erp/admin/minutes", "erp",
                                                                "erp/admin/minutes"),
                                                new PageMetaDto("자료보관", "/erp/admin/archive", "erp",
                                                                "erp/admin/archive"))));
        }
}