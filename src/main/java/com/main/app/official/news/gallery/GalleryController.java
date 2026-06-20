package com.main.app.official.news.gallery;

import com.main.app.common.dto.ApiResponse;
import com.main.app.official.news.gallery.dto.GalleryDto;
import com.main.app.official.news.gallery.dto.GalleryRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController("newsGalleryController")
@RequestMapping("/api/official/news/gallery")
@RequiredArgsConstructor
public class GalleryController {
    private final GalleryService galleryService;

    @GetMapping
    public ApiResponse<GalleryDto> getGallery() { return ApiResponse.ok(galleryService.getGallery()); }

    @PostMapping
    public ApiResponse<Void> createGallery(@RequestBody GalleryRequest request) throws Exception {
        galleryService.createGallery(request);
        return ApiResponse.ok(null, "갤러리 정보를 등록했습니다.");
    }

    @PutMapping
    public ApiResponse<Void> updateGallery(@RequestBody GalleryRequest request) throws Exception {
        galleryService.updateGallery(request);
        return ApiResponse.ok(null, "갤러리 정보를 수정했습니다.");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteGallery(@PathVariable String id) throws Exception {
        galleryService.deleteGallery(id);
        return ApiResponse.ok(null, "갤러리 정보를 삭제했습니다.");
    }
}