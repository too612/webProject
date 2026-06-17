package com.main.app.official.about.pastor;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.main.app.official.about.pastor.dto.PastorDto;
import com.main.app.official.about.pastor.dto.PastorRequest;

@Mapper
public interface PastorMapper {

    /**
     * 목회자 프로필 조회 (단건)
     */
    PastorDto selectProfile();

    /**
     * 목회자 프로필 등록
     * 
     * @return 생성된 corpId (useGeneratedKeys)
     */
    int insertProfile(PastorRequest request);

    /**
     * 목회자 프로필 수정
     */
    int updateProfile(PastorRequest request);

    /**
     * 목회자 프로필 소프트 삭제
     */
    int softDeleteProfile(@Param("corpId") Long corpId);

    /**
     * corpId로 목회자 프로필 조회 (내부 사용)
     */
    PastorDto selectProfileByCorpId(@Param("corpId") Long corpId);
}