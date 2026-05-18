package com.main.app.erp.controller;

import com.main.app.common.dto.ApiResponse;
import com.main.app.common.dto.PageMetaDto;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

@Controller
public class ErpIndexController {

    @GetMapping("/erp")
    public String index(Model model) {
        model.addAttribute("pageTitle", "ERP");
        return "erp/index";
    }

    @GetMapping("/humen/{page}")
    public String humen(@PathVariable("page") String page, Model model) {
        model.addAttribute("pageTitle", "Humen");
        return "erp/humen/" + page;
    }

    @GetMapping("/sermon/{page}")
    public String sermon(@PathVariable("page") String page, Model model) {
        model.addAttribute("pageTitle", "Sermon");
        return "erp/sermon/" + page;
    }

    @GetMapping("/account/{page}")
    public String account(@PathVariable("page") String page, Model model) {
        model.addAttribute("pageTitle", "Account");
        return "erp/account/" + page;
    }

    @GetMapping("/training/{page}")
    public String training(@PathVariable("page") String page, Model model) {
        model.addAttribute("pageTitle", "Training");
        return "erp/training/" + page;
    }

    @GetMapping("/ministry/{page}")
    public String ministry(@PathVariable("page") String page, Model model) {
        model.addAttribute("pageTitle", "Ministry");
        return "erp/ministry/" + page;
    }

    @GetMapping("/event/{page}")
    public String event(@PathVariable("page") String page, Model model) {
        model.addAttribute("pageTitle", "Event");
        return "erp/event/" + page;
    }

    @GetMapping("/facility/{page}")
    public String facility(@PathVariable("page") String page, Model model) {
        model.addAttribute("pageTitle", "Facility");
        return "erp/facility/" + page;
    }

    @GetMapping("/comm/{page}")
    public String comm(@PathVariable("page") String page, Model model) {
        model.addAttribute("pageTitle", "Communication");
        return "erp/comm/" + page;
    }

    @GetMapping("/stats/{page}")
    public String stats(@PathVariable("page") String page, Model model) {
        model.addAttribute("pageTitle", "Stats");
        return "erp/stats/" + page;
    }

    @GetMapping("/api/erp/pages")
    @ResponseBody
    public ApiResponse<Map<String, List<PageMetaDto>>> getPages() {
        return ApiResponse.ok(Map.of(
                "humen", List.of(
                        new PageMetaDto("Manager", "/erp/humen/manager", "erp", "erp/humen/manager"),
                        new PageMetaDto("District", "/erp/humen/district", "erp", "erp/humen/district"),
                        new PageMetaDto("Newcomer", "/erp/humen/newcomer", "erp", "erp/humen/newcomer"),
                        new PageMetaDto("Change", "/erp/humen/change", "erp", "erp/humen/change")),
                "sermon", List.of(
                        new PageMetaDto("Manager", "/erp/sermon/manager", "erp", "erp/sermon/manager"),
                        new PageMetaDto("Archive", "/erp/sermon/archive", "erp", "erp/sermon/archive"),
                        new PageMetaDto("Attendance", "/erp/sermon/attendance", "erp", "erp/sermon/attendance"),
                        new PageMetaDto("Write", "/erp/sermon/write", "erp", "erp/sermon/write"),
                        new PageMetaDto("Order", "/erp/sermon/order", "erp", "erp/sermon/order")),
                "account", List.of(
                        new PageMetaDto("Manager", "/erp/account/manager", "erp", "erp/account/manager"),
                        new PageMetaDto("Input", "/erp/account/input", "erp", "erp/account/input"),
                        new PageMetaDto("Budget", "/erp/account/budget", "erp", "erp/account/budget"),
                        new PageMetaDto("Expense", "/erp/account/expense", "erp", "erp/account/expense"),
                        new PageMetaDto("Report", "/erp/account/report", "erp", "erp/account/report")),
                "training", List.of(
                        new PageMetaDto("Course", "/erp/training/course", "erp", "erp/training/course"),
                        new PageMetaDto("Student", "/erp/training/student", "erp", "erp/training/student"),
                        new PageMetaDto("Attendance", "/erp/training/attendance", "erp", "erp/training/attendance"),
                        new PageMetaDto("Complete", "/erp/training/complete", "erp", "erp/training/complete")),
                "ministry", List.of(
                        new PageMetaDto("Department", "/erp/ministry/department", "erp", "erp/ministry/department"),
                        new PageMetaDto("Schedule", "/erp/ministry/schedule", "erp", "erp/ministry/schedule"),
                        new PageMetaDto("Volunteer", "/erp/ministry/volunteer", "erp", "erp/ministry/volunteer"),
                        new PageMetaDto("Report", "/erp/ministry/report", "erp", "erp/ministry/report"))));
    }

    @GetMapping("/api/erp/pages/extended")
    @ResponseBody
    public ApiResponse<Map<String, List<PageMetaDto>>> getPagesExtended() {
        return ApiResponse.ok(Map.of(
                "event", List.of(
                        new PageMetaDto("Calendar", "/erp/event/calendar", "erp", "erp/event/calendar"),
                        new PageMetaDto("Apply", "/erp/event/apply", "erp", "erp/event/apply"),
                        new PageMetaDto("Participant", "/erp/event/participant", "erp", "erp/event/participant"),
                        new PageMetaDto("Result", "/erp/event/result", "erp", "erp/event/result")),
                "facility", List.of(
                        new PageMetaDto("Reservation", "/erp/facility/reservation", "erp", "erp/facility/reservation"),
                        new PageMetaDto("Vehicle", "/erp/facility/vehicle", "erp", "erp/facility/vehicle"),
                        new PageMetaDto("Inventory", "/erp/facility/inventory", "erp", "erp/facility/inventory"),
                        new PageMetaDto("Maintenance", "/erp/facility/maintenance", "erp", "erp/facility/maintenance")),
                "comm", List.of(
                        new PageMetaDto("Notice", "/erp/comm/notice", "erp", "erp/comm/notice"),
                        new PageMetaDto("Message", "/erp/comm/message", "erp", "erp/comm/message"),
                        new PageMetaDto("Prayer", "/erp/comm/prayer", "erp", "erp/comm/prayer"),
                        new PageMetaDto("Newsletter", "/erp/comm/newsletter", "erp", "erp/comm/newsletter")),
                "stats", List.of(
                        new PageMetaDto("Dashboard", "/erp/stats/dashboard", "erp", "erp/stats/dashboard"),
                        new PageMetaDto("Attendance", "/erp/stats/attendance", "erp", "erp/stats/attendance"),
                        new PageMetaDto("Offering", "/erp/stats/offering", "erp", "erp/stats/offering"),
                        new PageMetaDto("Ministry", "/erp/stats/ministry", "erp", "erp/stats/ministry")),
                "admin", List.of(
                        new PageMetaDto("Certificate", "/erp/admin/certificate", "erp", "erp/admin/certificate"),
                        new PageMetaDto("Approval", "/erp/admin/approval", "erp", "erp/admin/approval"),
                        new PageMetaDto("Minutes", "/erp/admin/minutes", "erp", "erp/admin/minutes"),
                        new PageMetaDto("Archive", "/erp/admin/archive", "erp", "erp/admin/archive"))));
    }
}
