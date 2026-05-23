package com.main.app.community.facilities;

import com.main.app.common.util.PaginationUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("communityFacilitiesService")
public class FacilitiesService {

    private static final String FACILITIES_CALENDAR = "COMMUNITY_FACILITIES_CALENDAR";
    private static final String FACILITIES_DINING = "COMMUNITY_FACILITIES_DINING";
    private static final String FACILITIES_PRAYER = "COMMUNITY_FACILITIES_PRAYER";

    private final FacilitiesMapper facilitiesMapper;

    public FacilitiesService(FacilitiesMapper facilitiesMapper) {
        this.facilitiesMapper = facilitiesMapper;
    }

    public List<FacilitiesDto> getCalendar(String year, String month) {
        return facilitiesMapper.selectBoards(FACILITIES_CALENDAR, null, 0, 100);
    }

    public Page<FacilitiesDto> getDiningList(int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(page, size);
        List<FacilitiesDto> list = facilitiesMapper.selectBoards(FACILITIES_DINING, keyword, (int) pageable.getOffset(),
                pageable.getPageSize());
        long total = facilitiesMapper.countBoards(FACILITIES_DINING, keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public List<FacilitiesDto> getPrayerRooms() {
        return facilitiesMapper.selectBoards(FACILITIES_PRAYER, null, 0, 50);
    }
}
