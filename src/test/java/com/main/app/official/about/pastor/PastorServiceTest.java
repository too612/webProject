package com.main.app.official.about.pastor;

import com.main.app.official.about.pastor.dto.PastorRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PastorServiceTest {

    @Mock
    private PastorMapper pastorMapper;

    @InjectMocks
    private PastorService pastorService;

    private PastorRequest validRequest;

    @BeforeEach
    void setUp() {
        validRequest = new PastorRequest();
        validRequest.setCorpName("기관정보");
        validRequest.setBusinessRegistrationNumber("123-45-67890");
        validRequest.setChiefName("홍길동");
        validRequest.setCreatedBy("admin");
        validRequest.setCreatedIp("127.0.0.1");
        validRequest.setUpdatedBy("admin");
        validRequest.setUpdatedIp("127.0.0.1");
    }

    @Test
    void createPastorProfile_success() throws Exception {
        when(pastorMapper.insertPastorProfile(any(PastorRequest.class))).thenReturn(1);

        assertDoesNotThrow(() -> pastorService.createPastorProfile(validRequest));
        verify(pastorMapper).insertPastorProfile(any(PastorRequest.class));
    }

    @Test
    void createPastorProfile_fail_whenChiefNameMissing() {
        validRequest.setChiefName(" ");

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> pastorService.createPastorProfile(validRequest));

        assertEquals("담임목사 이름은 필수입니다.", ex.getMessage());
    }

    @Test
    void createPastorProfile_fail_whenBusinessRegistrationNumberMissing() {
        validRequest.setBusinessRegistrationNumber(null);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> pastorService.createPastorProfile(validRequest));

        assertEquals("사업자등록번호는 필수입니다.", ex.getMessage());
    }

    @Test
    void updatePastorProfile_success() throws Exception {
        when(pastorMapper.updatePastorProfile(eq(1L), any(PastorRequest.class))).thenReturn(1);

        assertDoesNotThrow(() -> pastorService.updatePastorProfile(1L, validRequest));
        verify(pastorMapper).updatePastorProfile(eq(1L), any(PastorRequest.class));
    }

    @Test
    void deletePastorProfile_success() throws Exception {
        when(pastorMapper.softDeletePastorProfile(anyLong(), any(), any())).thenReturn(1);

        assertDoesNotThrow(() -> pastorService.deletePastorProfile(1L, "admin", "127.0.0.1"));
        verify(pastorMapper).softDeletePastorProfile(1L, "admin", "127.0.0.1");
    }
}
