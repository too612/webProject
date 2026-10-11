package com.main.app.common.scheduler;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;

import org.junit.jupiter.api.Test;

class SchedulerJobRegistryTest {

    @Test
    void registersOnlyProvidedImplementations() {
        SchedulerJobRegistry registry = new SchedulerJobRegistry(List.of(
                SchedulerTestSupport.fixedJob("HRM_ASSIGNMENT_SYNC", SchedulerJobResult.empty())));

        assertThat(registry.getCodes()).containsExactly("HRM_ASSIGNMENT_SYNC");
        assertThat(registry.find("HRM_ASSIGNMENT_SYNC")).isPresent();
        assertThat(registry.find("java.lang.Runtime")).isEmpty();
        assertThat(registry.contains(null)).isFalse();
    }

    @Test
    void rejectsDuplicateCodes() {
        List<SchedulerJob> jobs = List.of(
                SchedulerTestSupport.fixedJob("JOB_A", SchedulerJobResult.empty()),
                SchedulerTestSupport.fixedJob("JOB_A", SchedulerJobResult.empty()));

        assertThatThrownBy(() -> new SchedulerJobRegistry(jobs))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Duplicate");
    }

    @Test
    void rejectsInvalidCodes() {
        assertThatThrownBy(() -> new SchedulerJobRegistry(List.of(
                SchedulerTestSupport.fixedJob("com.example.Bean#run", SchedulerJobResult.empty()))))
                .isInstanceOf(IllegalStateException.class);
        assertThatThrownBy(() -> new SchedulerJobRegistry(List.of(
                SchedulerTestSupport.fixedJob(null, SchedulerJobResult.empty()))))
                .isInstanceOf(IllegalStateException.class);
    }

    @Test
    void allowsEmptyRegistry() {
        assertThat(new SchedulerJobRegistry(null).getCodes()).isEmpty();
    }
}