package com.main.app.mypage.user.withdraw;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface WithdrawMapper {

    long countActivityList(@Param("userId") String userId);
}
