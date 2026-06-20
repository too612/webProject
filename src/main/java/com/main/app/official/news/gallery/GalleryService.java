package com.main.app.official.news.gallery;

import com.main.app.official.news.gallery.dto.GalleryDto;
import com.main.app.official.news.gallery.dto.GalleryRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GalleryService {
    private final GalleryMapper galleryMapper;

    @Transactional(readOnly = true)
    public GalleryDto getGallery() { return galleryMapper.selectGallery(); }

    @Transactional
    public void createGallery(GalleryRequest request) throws Exception {
        if (galleryMapper.insertGallery(request) != 1) throw new Exception("갤러리 정보 등록에 실패했습니다.");
    }

    @Transactional
    public void updateGallery(GalleryRequest request) throws Exception {
        if (galleryMapper.updateGallery(request) != 1) throw new Exception("갤러리 정보 수정에 실패했습니다.");
    }

    @Transactional
    public void deleteGallery(String id) throws Exception {
        if (galleryMapper.deleteGallery(id) != 1) throw new Exception("갤러리 정보 삭제에 실패했습니다.");
    }
}