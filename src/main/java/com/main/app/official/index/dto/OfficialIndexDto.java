package com.main.app.official.index.dto;

import lombok.Data;
import java.util.List;

@Data
public class OfficialIndexDto {
    private List<Item> recentAnnouncements;
    private List<BannerItem> slideBanners;
    private List<BannerItem> popupBanners;
    private List<Item> recentBulletins;
    private List<GalleryItem> recentGalleries;

    @Data
    public static class Item {
        private String id;
        private String title;
        private String date;
    }

    @Data
    public static class BannerItem {
        private String id;
        private String title;
        private String imageUrl;
        private String linkUrl;
        private String startDt;
        private String endDt;
        private String dismissOption;
    }

    @Data
    public static class GalleryItem {
        private String id;
        private String title;
        private String imageUrl;
        private String date;
        private String contentHtml;
    }
}