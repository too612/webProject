package com.main.app.erp.humen.change;

import com.main.app.erp.humen.change.dto.ChangeDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ChangeMapper {

    List<ChangeDto.Change> selectChangeList(@Param("keyword") String keyword,
                                            @Param("offset") int offset,
                                            @Param("limit") int limit);

    long countChangeList(@Param("keyword") String keyword);
}
