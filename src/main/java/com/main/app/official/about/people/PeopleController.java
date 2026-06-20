package com.main.app.official.about.people;

import com.main.app.common.dto.ApiResponse;
import com.main.app.official.about.people.dto.PeopleDto;
import com.main.app.official.about.people.dto.PeopleRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/official/about/people")
@RequiredArgsConstructor
public class PeopleController {

    private final PeopleService peopleService;

    @GetMapping
    public ApiResponse<PeopleDto> getPeople() {
        return ApiResponse.ok(peopleService.getPeople());
    }

    @PostMapping
    public ApiResponse<Void> createPeople(@RequestBody PeopleRequest request) throws Exception {
        peopleService.createPeople(request);
        return ApiResponse.ok(null, "비전 정보를 등록했습니다.");
    }

    @PutMapping("/{id}")
    public ApiResponse<Void> updatePeople(@PathVariable Long id, @RequestBody PeopleRequest request) throws Exception {
        peopleService.updatePeople(id, request);
        return ApiResponse.ok(null, "비전 정보를 수정했습니다.");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deletePeople(@PathVariable Long id) throws Exception {
        peopleService.deletePeople(id);
        return ApiResponse.ok(null, "비전 정보를 삭제했습니다.");
    }
}