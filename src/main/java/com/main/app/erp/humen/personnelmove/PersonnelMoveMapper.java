package com.main.app.erp.humen.personnelmove;

import com.main.app.erp.humen.personnelmove.dto.PersonnelMoveDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PersonnelMoveMapper {

    List<PersonnelMoveDto.PersonnelMove> selectPersonnelMoveList(@Param("keyword") String keyword,
                                            @Param("offset") int offset,
                                            @Param("limit") int limit);

    long countPersonnelMoveList(@Param("keyword") String keyword);
}
