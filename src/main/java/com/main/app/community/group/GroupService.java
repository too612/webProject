package com.main.app.community.group;

import com.main.app.common.util.PaginationUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("communityGroupService")
public class GroupService {

    private static final String GROUP_MANAGER = "COMMUNITY_GROUP_MANAGER";
    private static final String GROUP_A1 = "COMMUNITY_GROUP_A1";
    private static final String GROUP_B2 = "COMMUNITY_GROUP_B2";

    private final GroupMapper groupMapper;

    public GroupService(GroupMapper groupMapper) {
        this.groupMapper = groupMapper;
    }

    public Page<GroupDto> getGroupList(int page, int size, String keyword) {
        return getPaged(page, size, keyword, GROUP_MANAGER);
    }

    public Page<GroupDto> getGroupA1List(int page, int size, String keyword) {
        return getPaged(page, size, keyword, GROUP_A1);
    }

    public Page<GroupDto> getGroupB2List(int page, int size, String keyword) {
        return getPaged(page, size, keyword, GROUP_B2);
    }

    private Page<GroupDto> getPaged(int page, int size, String keyword, String boardType) {
        Pageable pageable = PageRequest.of(page, size);
        List<GroupDto> list = groupMapper.selectBoards(boardType, keyword, (int) pageable.getOffset(),
                pageable.getPageSize());
        long total = groupMapper.countBoards(boardType, keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }
}
