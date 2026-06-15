package com.main.app.official.about.pastor;

import com.main.app.common.file.FileService;
import com.main.app.common.util.ClientIpUtil;
import com.main.app.common.util.StringUtil;
import com.main.app.official.about.pastor.dto.PastorDto;
import com.main.app.official.about.pastor.dto.PastorRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service("officialPastorService")
@RequiredArgsConstructor
@Slf4j
public class PastorService {

    private static final String DISPLAY_MODE_SINGLE_IMAGE = "single-image";
    private static final String DISPLAY_MODE_SPLIT = "split-editor-image";

    private final PastorMapper pastorMapper;
    private final FileService fileService;

    /**
     * 담임목사 소개 정보를 조회하고, 식별자가 있으면 첨부 파일 목록을 함께 반환한다.
     */
    @Transactional(readOnly = true)
    public PastorDto getInfo() {
        PastorDto profile = pastorMapper.selectPastorProfile();
        if (profile != null && profile.getCorpId() != null) {
            try {
                profile.setFileList(fileService.getFileList("pastor", String.valueOf(profile.getCorpId())));
            } catch (Exception ex) {
                log.warn("Failed to load pastor file list for corpId={}", profile.getCorpId(), ex);
            }
        }
        return profile;
    }

    /**
     * 담임목사 소개 정보를 신규 등록한다.
     * 필수값 검증, 표시 모드 정규화, 생성/수정자 및 IP 기본값 보정을 수행한다.
     */
    @Transactional
    public void setCreate(PastorRequest request, List<MultipartFile> files) throws Exception {
        String sessIp = resolveClientIp();
        if (request.getChiefName() == null || request.getChiefName().isBlank()) {
            throw new IllegalArgumentException("담임목사 이름은 필수입니다.");
        }
        if (request.getCorpName() == null || request.getCorpName().isBlank()) {
            request.setCorpName("기관정보");
        }
        if (request.getBusinessRegistrationNumber() == null || request.getBusinessRegistrationNumber().isBlank()) {
            throw new IllegalArgumentException("사업자등록번호는 필수입니다.");
        }

        String effectiveCreatedBy = StringUtil.coalesceBlank(request.getCreatedBy(), "system");
        String effectiveUpdatedBy = StringUtil.coalesceBlank(request.getUpdatedBy(), effectiveCreatedBy);
        String effectiveIp = StringUtil.coalesceBlank(sessIp, "127.0.0.1");

        request.setDisplayMode(normalizeDisplayMode(request.getDisplayMode()));
        request.setCreatedBy(effectiveCreatedBy);
        request.setUpdatedBy(effectiveUpdatedBy);
        request.setCreatedIp(effectiveIp);
        request.setUpdatedIp(effectiveIp);

        int result = pastorMapper.insertPastorProfile(request);
        if (result != 1) {
            throw new Exception("담임목사 정보 등록에 실패했습니다.");
        }

        if (request.getCorpId() != null) {
            fileService.uploadFiles("pastor", String.valueOf(request.getCorpId()), files,
                    effectiveUpdatedBy, effectiveIp);
        }
    }

    /**
     * 담임목사 소개 정보를 수정한다.
     * 표시 모드와 수정 메타데이터를 정규화하고, 삭제 요청 파일 및 신규 첨부를 반영한다.
     */
    @Transactional
    public void setUpdate(Long corpId, PastorRequest request, List<MultipartFile> files) throws Exception {
        String effectiveUpdatedBy = StringUtil.coalesceBlank(request.getUpdatedBy(), "system");
        String effectiveUpdatedIp = StringUtil.coalesceBlank(resolveClientIp(), "127.0.0.1");

        request.setDisplayMode(normalizeDisplayMode(request.getDisplayMode()));
        request.setUpdatedBy(effectiveUpdatedBy);
        request.setUpdatedIp(effectiveUpdatedIp);

        int result = pastorMapper.updatePastorProfile(corpId, request);
        if (result != 1) {
            throw new Exception("담임목사 정보 수정에 실패했습니다.");
        }

        if (request.getDeletedFileIds() != null) {
            request.getDeletedFileIds().forEach(fileService::softDeleteFile);
        }

        if (files != null && !files.isEmpty()) {
            fileService.softDeleteFilesByRef("pastor", String.valueOf(corpId));
            fileService.uploadFiles("pastor", String.valueOf(corpId), files, effectiveUpdatedBy,
                    effectiveUpdatedIp);
        }
    }

    /**
     * 담임목사 소개 정보를 소프트 삭제한다.
     * 수정자와 IP 기본값을 보정한 뒤 삭제 메타데이터를 기록한다.
     */
    @Transactional
    public void delRemove(Long corpId, String updatedBy) throws Exception {
        updatedBy = StringUtil.coalesceBlank(updatedBy, "system");
        String updatedIp = StringUtil.coalesceBlank(resolveClientIp(), "127.0.0.1");

        int result = pastorMapper.softDeletePastorProfile(corpId, updatedBy, updatedIp);
        if (result != 1) {
            throw new Exception("담임목사 정보 삭제에 실패했습니다.");
        }
    }

    /**
     * 허용된 표시 모드만 통과시키고, 그 외 값은 분리형 모드로 고정한다.
     */
    private String normalizeDisplayMode(String displayMode) {
        if (DISPLAY_MODE_SINGLE_IMAGE.equals(displayMode)) {
            return DISPLAY_MODE_SINGLE_IMAGE;
        }
        return DISPLAY_MODE_SPLIT;
    }

    /**
     * 현재 요청 컨텍스트에서 클라이언트 IP를 해석한다.
     * 컨텍스트를 얻을 수 없거나 실패하면 루프백 주소를 반환한다.
     */
    private String resolveClientIp() {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder
                    .getRequestAttributes();
            if (attributes != null && attributes.getRequest() != null) {
                return ClientIpUtil.resolveClientIp(attributes.getRequest());
            }
        } catch (Exception ex) {
            log.debug("Failed to resolve client IP from request context", ex);
        }
        return "127.0.0.1";
    }
}
