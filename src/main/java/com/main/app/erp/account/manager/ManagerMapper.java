package com.main.app.erp.account.manager;

import com.main.app.erp.account.manager.dto.ManagerDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ManagerMapper {

    List<ManagerDto.Offering> selectOfferingList(@Param("keyword") String keyword,
                                                        @Param("offset") int offset,
                                                        @Param("limit") int limit);

    long countOfferingList(@Param("keyword") String keyword);
}

