package com.main.app.official.missionary;

import com.main.app.official.missionary.dto.MissionaryDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface MissionaryMapper {

    /*
     * 운영 데이터 조회 원본
     *
     * @Select("""
     *     SELECT
     *         ha.employee_no as employeeNo,
     *         hp.person_key as personKey,
     *         hp.name_ko as name,
     *         scc.country_name_ko as country,
     *         ha.dispatch_country_code as countryCode,
     *         ha.assignment_date as dispatchedDate,
     *         ha.assignment_date as dispatchDate,
     *         ha.assignment_content as assignmentContent,
     *         ha.dispatch_country_code as groupKey
     *     FROM hrm_assignment ha
     *     JOIN hrm_person hp ON ha.person_key = hp.person_key
     *     JOIN sys_country_code scc ON ha.dispatch_country_code = scc.country_code
     *     WHERE hp.grade_code = '102-060'
     *       AND ha.dispatch_country_code IS NOT NULL
     *       AND ha.del_yn = 'N'
     *     ORDER BY ha.assignment_date ASC
     *     """)
     */
    @Select("""
        SELECT
            missionary.employeeNo,
            missionary.personKey,
            missionary.name,
            missionary.country,
            missionary.countryCode,
            missionary.city,
            missionary.region,
            missionary.latitude,
            missionary.longitude,
            missionary.dispatchedDate,
            missionary.dispatchDate,
            missionary.assignmentContent,
            missionary.groupKey
        FROM (VALUES
            ('TEST-SEOUL-01', 'TEST-PERSON-01', '김하늘', '대한민국', 'KR', '서울', '서울특별시', 37.5665, 126.9780, DATE '2020-03-01', DATE '2020-03-01', '서울 북부 지역 교회 개척', 'KR'),
            ('TEST-SEOUL-02', 'TEST-PERSON-02', '이은서', '대한민국', 'KR', '서울', '서울특별시', 37.5665, 126.9780, DATE '2021-06-15', DATE '2021-06-15', '서울 남부 지역 제자 훈련', 'KR'),
            ('TEST-MANILA-01', 'TEST-PERSON-03', '박도윤', '필리핀', 'PH', '마닐라', '메트로 마닐라', 14.5995, 120.9842, DATE '2018-09-01', DATE '2018-09-01', '마닐라 현지 교회 협력', 'PH'),
            ('TEST-PHNOM-01', 'TEST-PERSON-04', '최수아', '캄보디아', 'KH', '프놈펜', '프놈펜 특별시', 11.5564, 104.9282, DATE '2019-02-01', DATE '2019-02-01', '프놈펜 다음 세대 사역', 'KH')
        ) AS missionary(
            employeeNo,
            personKey,
            name,
            country,
            countryCode,
            city,
            region,
            latitude,
            longitude,
            dispatchedDate,
            dispatchDate,
            assignmentContent,
            groupKey
        )
        ORDER BY missionary.dispatchedDate ASC, missionary.employeeNo ASC
        """)
    List<MissionaryDto> selectMissionaries();
}
