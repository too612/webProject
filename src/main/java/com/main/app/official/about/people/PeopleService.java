package com.main.app.official.about.people;

import com.main.app.official.about.people.dto.PeopleDto;
import com.main.app.official.about.people.dto.PeopleRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PeopleService {

    private final PeopleMapper peopleMapper;

    @Transactional(readOnly = true)
    public PeopleDto getPeople() {
        return peopleMapper.selectPeople();
    }

    @Transactional
    public void createPeople(PeopleRequest request) throws Exception {
        int result = peopleMapper.insertPeople(request);
        if (result != 1) {
            throw new Exception("비전 정보 등록에 실패했습니다.");
        }
    }

    @Transactional
    public void updatePeople(Long id, PeopleRequest request) throws Exception {
        int result = peopleMapper.updatePeople(id, request);
        if (result != 1) {
            throw new Exception("비전 정보 수정에 실패했습니다.");
        }
    }

    @Transactional
    public void deletePeople(Long id) throws Exception {
        int result = peopleMapper.deletePeople(id);
        if (result != 1) {
            throw new Exception("비전 정보 삭제에 실패했습니다.");
        }
    }
}