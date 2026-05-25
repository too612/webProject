package com.main.app.community.saint.job;

import com.main.app.common.dto.ApiResponse;
import com.main.app.community.saint.job.dto.JobDto;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

@Controller("communitySaintJobController")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping("/community/saint/job")
    public String jobPage(Model model) {
        model.addAttribute("submenu", "Y");
        return "community/saint/job";
    }

    @GetMapping("/api/community/saint/job")
    @ResponseBody
    public ApiResponse<Map<String, Object>> getJobList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        Page<JobDto> data = jobService.getList(page, size, keyword);
        return ApiResponse.ok(Map.of(
                "content", data.getContent(),
                "totalElements", data.getTotalElements(),
                "totalPages", data.getTotalPages(),
                "number", data.getNumber(),
                "size", data.getSize()));
    }
}