package com.main.app.official.about.pastor;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;

import com.main.app.common.attachment.AttachmentService;
import com.main.app.common.attachment.dto.AttachmentDto;
import com.main.app.common.util.ClientIpUtil;
import com.main.app.official.about.pastor.dto.PastorDto;
import com.main.app.official.about.pastor.dto.PastorRequest;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PastorService {

    private final PastorMapper pastorMapper;
    private final AttachmentService fileService;

    private static final String PGM_ID = "pastor";

    // =========================================================================
    // 표준 API 메서드 (Controller 호출용) - FRONT-FULLSTACK-SPEC.md 준수
    // =========================================================================

    /**
     * 단건 조회 (getInfo)
     */
    @Transactional(readOnly = true)
    public PastorDto getInfo() {
        return getProfileInternal();
    }

    /**
     * 등록 (setCreate)
     */
    @Transactional
    public void setCreate(PastorRequest request, List<MultipartFile> files) {
        String ip = getClientIp();
        saveProfileInternal(request, files, ip);
    }

    /**
     * 수정 (setUpdate)
     */
    @Transactional
    public void setUpdate(Long corpId, PastorRequest request, List<MultipartFile> files) {
        // Request에 corpId가 없을 수 있으므로 명시적으로 설정
        request.setCorpId(corpId);
        String ip = getClientIp();
        updateProfileInternal(request, files, ip);
    }

    /**
     * 삭제 (delRemove)
     */
    @Transactional
    public void delRemove(Long corpId, String updatedBy) {
        deleteProfileInternal(corpId, updatedBy);
    }

    // =========================================================================
    // 내부 비즈니스 로직 (실제 구현)
    // =========================================================================

    /**
     * 프로필 조회 (내부)
     */
    private PastorDto getProfileInternal() {
        PastorDto dto = pastorMapper.selectProfile();
        if (dto != null && dto.getCorpId() != null) {
            List<AttachmentDto> files = fileService.getFileList(PGM_ID, String.valueOf(dto.getCorpId()));
            dto.setFileList(files);
        }
        return dto;
    }

    /**
     * 프로필 저장 (내부)
     */
    private void saveProfileInternal(PastorRequest request, List<MultipartFile> files, String ip) {
        // 기본값 설정
        if (!StringUtils.hasText(request.getCorpName())) {
            request.setCorpName("기관정보");
        }
        if (!StringUtils.hasText(request.getChiefName())) {
            request.setChiefName("담임목사");
        }

        // DB 저장
        pastorMapper.insertProfile(request);

        // 파일 업로드 (file_usage='attachment')
        if (files != null && !files.isEmpty()) {
            String corpId = String.valueOf(request.getCorpId());
            fileService.uploadFiles(PGM_ID, corpId, files, null, ip, "attachment");
        }

        log.info("Pastor profile saved: corpId={}", request.getCorpId());
    }

    /**
     * 프로필 수정 (내부)
     */
    private void updateProfileInternal(PastorRequest request, List<MultipartFile> files, String ip) {
        if (request.getCorpId() == null) {
            throw new IllegalArgumentException("corpId가 필요합니다.");
        }

        // DB 업데이트
        pastorMapper.updateProfile(request);

        // 삭제할 파일 처리
        if (request.getDeletedFileIds() != null && !request.getDeletedFileIds().isEmpty()) {
            for (Long fileId : request.getDeletedFileIds()) {
                fileService.softDeleteFile(fileId);
            }
        }

        // 새 파일 업로드
        if (files != null && !files.isEmpty()) {
            String corpId = String.valueOf(request.getCorpId());
            fileService.uploadFiles(PGM_ID, corpId, files, null, ip, "attachment");
        }

        log.info("Pastor profile updated: corpId={}", request.getCorpId());
    }

    /**
     * 프로필 삭제 (내부)
     */
    private void deleteProfileInternal(Long corpId, String updatedBy) {
        // 연관 파일 소프트 삭제
        fileService.softDeleteFilesByRef(PGM_ID, String.valueOf(corpId));

        // 프로필 소프트 삭제
        pastorMapper.softDeleteProfile(corpId);

        log.info("Pastor profile deleted: corpId={}, updatedBy={}", corpId, updatedBy);
    }

    // =========================================================================
    // 유틸리티
    // =========================================================================

    /**
     * 현재 요청의 클라이언트 IP를 추출합니다.
     * (ClientIpUtil이 있다면 그것을 사용하는 것이 좋습니다)
     */
    private String getClientIp() {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder
                    .getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                // ClientIpUtil이 있다면 아래 주석 해제
                // return ClientIpUtil.getClientIp(request);
                return request.getRemoteAddr();
            }
        } catch (Exception e) {
            log.warn("Failed to get client IP, using default", e);
        }
        return "127.0.0.1";
    }
}