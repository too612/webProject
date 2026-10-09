package com.main.app.official;

import com.main.app.official.news.mission.MissionController;
import com.main.app.official.news.mission.MissionMapper;
import com.main.app.official.news.mission.MissionService;
import com.main.app.official.news.mission.dto.MissionDto;
import com.main.app.official.training.outreach.OutreachController;
import com.main.app.official.training.outreach.OutreachMapper;
import com.main.app.official.training.outreach.OutreachService;
import com.main.app.official.training.outreach.dto.OutreachDto;
import org.apache.ibatis.builder.xml.XMLMapperBuilder;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.Configuration;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class MissionDomainFlowTest {

    @Test
    void outreachRequestUsesItsOwnMapperAndReturnsMapFields() throws Exception {
        OutreachMapper mapper = mock(OutreachMapper.class);
        OutreachDto item = new OutreachDto();
        item.setEmployeeNo("TEST-SEOUL-01");
        item.setCountryCode("KR");
        item.setCity("Seoul");
        item.setLatitude(37.5665);
        item.setLongitude(126.9780);
        when(mapper.getInfo()).thenReturn(List.of(item));

        var mvc = MockMvcBuilders.standaloneSetup(
                new OutreachController(new OutreachService(mapper))).build();

        mvc.perform(get("/api/official/training/outreach/getInfo"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].employeeNo").value("TEST-SEOUL-01"))
                .andExpect(jsonPath("$.data[0].city").value("Seoul"))
                .andExpect(jsonPath("$.data[0].latitude").value(37.5665))
                .andExpect(jsonPath("$.data[0].longitude").value(126.9780));
        verify(mapper).getInfo();
        verifyNoMoreInteractions(mapper);
    }

    @Test
    void missionRequestUsesItsOwnMapperAndReturnsSummaryFields() throws Exception {
        MissionMapper mapper = mock(MissionMapper.class);
        MissionDto item = new MissionDto();
        item.setEmployeeNo("TEST-MANILA-01");
        item.setCountryCode("PH");
        item.setGroupKey("PH");
        item.setAssignmentContent("Local church cooperation");
        when(mapper.getInfo()).thenReturn(List.of(item));

        var mvc = MockMvcBuilders.standaloneSetup(
                new MissionController(new MissionService(mapper))).build();

        mvc.perform(get("/api/official/news/mission/getInfo"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].employeeNo").value("TEST-MANILA-01"))
                .andExpect(jsonPath("$.data[0].groupKey").value("PH"))
                .andExpect(jsonPath("$.data[0].assignmentContent").value("Local church cooperation"));
        verify(mapper).getInfo();
        verifyNoMoreInteractions(mapper);
    }

    @Test
    void emptyListsRemainSuccessfulAndLegacyEndpointIsNotRegistered() throws Exception {
        OutreachMapper outreachMapper = mock(OutreachMapper.class);
        MissionMapper missionMapper = mock(MissionMapper.class);
        when(outreachMapper.getInfo()).thenReturn(List.of());
        when(missionMapper.getInfo()).thenReturn(List.of());
        var mvc = MockMvcBuilders.standaloneSetup(
                new OutreachController(new OutreachService(outreachMapper)),
                new MissionController(new MissionService(missionMapper))).build();

        for (String endpoint : List.of(
                "/api/official/training/outreach/getInfo", "/api/official/news/mission/getInfo")) {
            mvc.perform(get(endpoint))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data").isEmpty());
        }
        mvc.perform(get("/api/official/missionaries")).andExpect(status().isNotFound());
    }

    @Test
    void mapperFailuresAreNotConvertedToEmptySuccess() {
        OutreachMapper outreachMapper = mock(OutreachMapper.class);
        MissionMapper missionMapper = mock(MissionMapper.class);
        when(outreachMapper.getInfo()).thenThrow(new IllegalStateException("Query failed"));
        when(missionMapper.getInfo()).thenThrow(new IllegalStateException("Query failed"));

        assertThrows(IllegalStateException.class, () -> new OutreachService(outreachMapper).getInfo());
        assertThrows(IllegalStateException.class, () -> new MissionService(missionMapper).getInfo());
    }

    @Test
    void xmlQueriesBindToIndependentMapperInterfacesAndDtos() throws Exception {
        Configuration configuration = new Configuration();
        configuration.setMapUnderscoreToCamelCase(true);
        for (String resource : List.of(
                "mapper/official/training/outreach/OutreachMapper.xml",
                "mapper/official/news/mission/MissionMapper.xml")) {
            try (var input = Resources.getResourceAsStream(resource)) {
                new XMLMapperBuilder(input, configuration, resource, configuration.getSqlFragments()).parse();
            }
        }

        assertQuery(configuration, OutreachMapper.class, OutreachDto.class);
        assertQuery(configuration, MissionMapper.class, MissionDto.class);
        assertEquals(
                configuration.getMappedStatement(OutreachMapper.class.getName() + ".getInfo")
                        .getBoundSql(null).getSql(),
                configuration.getMappedStatement(MissionMapper.class.getName() + ".getInfo")
                        .getBoundSql(null).getSql());
    }

    private void assertQuery(Configuration configuration, Class<?> mapper, Class<?> dto)
            throws Exception {
        var statement = configuration.getMappedStatement(mapper.getName() + ".getInfo");
        assertEquals(dto, statement.getResultMaps().getFirst().getType());
        assertTrue(configuration.hasMapper(mapper));
        assertEquals(0, mapper.getMethod("getInfo").getDeclaredAnnotations().length);
        String sql = statement.getBoundSql(null).getSql();
        for (String fragment : List.of(
                "FROM hrm_assignment a",
                "JOIN hrm_person p ON p.person_key = a.person_key",
                "JOIN sys_country_code c ON c.country_code = a.dispatch_country_code",
                "PARTITION BY a.person_key",
                "a.assignment_date DESC, a.reg_dtm DESC, a.assignment_key DESC",
                "a.del_yn = 'N'", "a.assignment_type_code = '105-030'",
                "a.grade_code = '102-060'", "a.assignment_date <= CURRENT_DATE",
                "a.assignment_end_date >= CURRENT_DATE", "a.dispatch_rank = 1",
                "p.service_status_code = '101-010'", "p.retire_date > CURRENT_DATE",
                "c.use_yn = 'Y'", "NULL::TEXT AS city", "NULL::TEXT AS region",
                "c.map_latitude AS latitude", "c.map_longitude AS longitude",
                "a.assignment_date AS dispatched_date", "a.assignment_date AS dispatch_date",
                "a.dispatch_country_code AS group_key",
                "ORDER BY a.assignment_date ASC, p.employee_no ASC")) {
            assertTrue(sql.contains(fragment), fragment);
        }
        assertFalse(sql.contains("TEST-"));
        assertFalse(sql.contains("VALUES"));
    }
}
