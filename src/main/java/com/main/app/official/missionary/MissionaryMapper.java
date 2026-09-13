package com.main.app.official.missionary;

import com.main.app.official.missionary.dto.MissionaryDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface MissionaryMapper {
    
    @Select("""
        SELECT 
            ha.employee_no as employeeNo,
            hp.person_key as personKey,
            hp.name_ko as name,
            scc.country_name_ko as country,
            ha.dispatch_country_code as countryCode,
            ha.assignment_date as dispatchedDate,
            ha.assignment_date as dispatchDate,
            ha.assignment_content as assignmentContent,
            ha.dispatch_country_code as groupKey
        FROM hrm_assignment ha
        JOIN hrm_person hp ON ha.person_key = hp.person_key
        JOIN sys_country_code scc ON ha.dispatch_country_code = scc.country_code
        WHERE hp.grade_code = '102-060'
          AND ha.dispatch_country_code IS NOT NULL
          AND ha.del_yn = 'N'
        ORDER BY ha.assignment_date ASC
        """)
    List<MissionaryDto> selectMissionaries();
}
