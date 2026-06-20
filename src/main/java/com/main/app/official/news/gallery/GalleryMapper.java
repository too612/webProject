package com.main.app.official.news.gallery;

import com.main.app.official.news.gallery.dto.GalleryDto;
import com.main.app.official.news.gallery.dto.GalleryRequest;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface GalleryMapper {
    GalleryDto selectGallery();
    int insertGallery(GalleryRequest request);
    int updateGallery(GalleryRequest request);
    int deleteGallery(String id);
}