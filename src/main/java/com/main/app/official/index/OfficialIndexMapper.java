package com.main.app.official.index;

import com.main.app.official.index.dto.OfficialIndexDto;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface OfficialIndexMapper {
    List<OfficialIndexDto.Item> selectRecentAnnouncements();
    List<OfficialIndexDto.BannerItem> selectSlideBanners();
    List<OfficialIndexDto.BannerItem> selectPopupBanners();
    List<OfficialIndexDto.Item> selectRecentBulletins();
    List<OfficialIndexDto.GalleryItem> selectRecentGalleries();
}