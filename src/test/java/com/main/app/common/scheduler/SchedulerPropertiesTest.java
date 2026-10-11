package com.main.app.common.scheduler;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.Duration;
import java.time.ZoneId;

import org.junit.jupiter.api.Test;

class SchedulerPropertiesTest {

    @Test
    void defaultsAreConservative() {
        SchedulerProperties properties = new SchedulerProperties();

        assertThat(properties.isEnabled()).isFalse();
        assertThat(properties.reloadDelay()).isEqualTo(Duration.ofMinutes(5));
        assertThat(properties.initialDelay()).isEqualTo(Duration.ofSeconds(30));
        assertThat(properties.zoneId()).isEqualTo(ZoneId.of("Asia/Seoul"));
    }

    @Test
    void blankZoneFallsBackToSeoul() {
        SchedulerProperties properties = new SchedulerProperties();
        properties.setZone(" ");

        assertThat(properties.zoneId()).isEqualTo(ZoneId.of("Asia/Seoul"));
    }

    @Test
    void invalidZoneIsRejectedWithDescriptiveError() {
        SchedulerProperties properties = new SchedulerProperties();

        assertThatThrownBy(() -> properties.setZone("Seoul/Korea"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("app.scheduler.zone")
                .hasMessageContaining("Seoul/Korea");
    }

    @Test
    void invalidDurationsAreRejectedInsteadOfClamped() {
        SchedulerProperties properties = new SchedulerProperties();

        assertThatThrownBy(() -> properties.setReloadDelayMs(1_000L))
                .hasMessageContaining("app.scheduler.reload-delay-ms");
        assertThatThrownBy(() -> properties.setInitialDelayMs(-1L))
                .hasMessageContaining("app.scheduler.initial-delay-ms");
        assertThatThrownBy(() -> properties.setPoolSize(0))
                .hasMessageContaining("app.scheduler.pool-size");
        assertThat(properties.reloadDelay()).isEqualTo(Duration.ofMinutes(5));
    }
}