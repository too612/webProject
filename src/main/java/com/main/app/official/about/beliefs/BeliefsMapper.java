package com.main.app.official.about.beliefs;

import com.main.app.official.about.beliefs.dto.BeliefsDto;
import com.main.app.official.about.beliefs.dto.BeliefsRequest;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface BeliefsMapper {

    BeliefsDto selectBeliefs();

    int insertBeliefs(BeliefsRequest request);

    int updateBeliefs(@Param("id") Long id, @Param("request") BeliefsRequest request);

    int deleteBeliefs(@Param("id") Long id);
}
