package com.main.app.common.scheduler;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.InputStream;
import java.lang.reflect.Method;
import java.util.Arrays;

import org.apache.ibatis.builder.xml.XMLMapperBuilder;
import org.apache.ibatis.session.Configuration;
import org.junit.jupiter.api.Test;

class SchedulerMapperXmlTest {

    private static final String RESOURCE = "mapper/common/scheduler/SchedulerMapper.xml";

    @Test
    void everyMapperMethodHasMatchingStatement() throws Exception {
        Configuration configuration = new Configuration();
        configuration.setMapUnderscoreToCamelCase(true);
        try (InputStream input = getClass().getClassLoader().getResourceAsStream(RESOURCE)) {
            assertThat(input).isNotNull();
            new XMLMapperBuilder(input, configuration, RESOURCE, configuration.getSqlFragments()).parse();
        }

        String namespace = SchedulerMapper.class.getName();
        for (Method method : SchedulerMapper.class.getDeclaredMethods()) {
            assertThat(configuration.hasStatement(namespace + "." + method.getName()))
                    .as(method.getName())
                    .isTrue();
        }
        assertThat(Arrays.stream(SchedulerMapper.class.getDeclaredMethods()).count()).isEqualTo(11);
    }
}