package com.main.app.erp.humen;

import org.apache.ibatis.builder.xml.XMLMapperBuilder;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.Configuration;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertTrue;

class AssignmentConsumerTest {
    @Test
    void existingPersonalHistoryQueriesExcludeConcurrentAssignmentsAndRespectOrder() throws Exception {
        Configuration configuration = new Configuration();
        for (String resource : java.util.List.of(
                "mapper/erp/humen/manager/ManagerMapper.xml",
                "mapper/erp/humen/myprofile/MyProfileMapper.xml")) {
            try (var input = Resources.getResourceAsStream(resource)) {
                new XMLMapperBuilder(input, configuration, resource, configuration.getSqlFragments()).parse();
            }
        }
        for (String statement : java.util.List.of(
                "com.main.app.erp.humen.manager.ManagerMapper.selectAssignmentList",
                "com.main.app.erp.humen.myprofile.MyProfileMapper.selectAssignments")) {
            String sql = configuration.getMappedStatement(statement)
                    .getBoundSql(Map.of("personKey", "test")).getSql();
            assertTrue(sql.contains("a.concurrent_assignment_yn = 'N'"));
            assertTrue(sql.contains("a.assignment_date DESC, a.assignment_order DESC"));
            assertTrue(sql.contains("a.del_yn = 'N'"));
        }
    }
}
