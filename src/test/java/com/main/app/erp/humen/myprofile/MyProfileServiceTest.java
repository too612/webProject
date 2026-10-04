package com.main.app.erp.humen.myprofile;

import com.main.app.erp.humen.myprofile.dto.MyProfileDto;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

class MyProfileServiceTest {

    @Test
    void profileLoadsOnlyTheLinkedEmployeesRelatedRecords() {
        MyProfileMapper mapper = mock(MyProfileMapper.class);
        MyProfileDto.Profile profile = new MyProfileDto.Profile();
        profile.setEmployeeNo("EMP-1");
        when(mapper.selectProfileByUserId("user-1")).thenReturn(profile);
        when(mapper.selectPersonKeyByUserId("user-1")).thenReturn("person-key");
        when(mapper.selectAssignments("person-key")).thenReturn(List.of(new MyProfileDto.Assignment()));
        when(mapper.selectCareers("person-key")).thenReturn(List.of(new MyProfileDto.Career()));
        when(mapper.selectEducations("person-key")).thenReturn(List.of(new MyProfileDto.Education()));
        MyProfileService service = new MyProfileService(mapper);

        MyProfileDto.Profile result = service.getMyProfile("user-1");

        assertThat(result.getAssignments()).hasSize(1);
        assertThat(result.getCareers()).hasSize(1);
        assertThat(result.getEducations()).hasSize(1);
        verify(mapper).selectAssignments("person-key");
        verify(mapper).selectCareers("person-key");
        verify(mapper).selectEducations("person-key");
    }

    @Test
    void profileWithoutAnEmployeeLinkStillReturnsAccountInformation() {
        MyProfileMapper mapper = mock(MyProfileMapper.class);
        MyProfileDto.Profile profile = new MyProfileDto.Profile();
        profile.setEmail("person@example.com");
        when(mapper.selectProfileByUserId("user-1")).thenReturn(profile);
        MyProfileService service = new MyProfileService(mapper);

        MyProfileDto.Profile result = service.getMyProfile("user-1");

        assertThat(result.getEmail()).isEqualTo("person@example.com");
        assertThat(result.getEmployeeLinked()).isFalse();
        assertThat(result.getAssignments()).isEmpty();
        assertThat(result.getCareers()).isEmpty();
        assertThat(result.getEducations()).isEmpty();

        verify(mapper).selectProfileByUserId("user-1");
        verifyNoMoreInteractions(mapper);
    }

    @Test
    void contactUpdateNormalizesOptionalAddressFieldsAndUpdatesOnlyTheAccount() {
        MyProfileMapper mapper = mock(MyProfileMapper.class);
        MyProfileDto.Profile profile = new MyProfileDto.Profile();
        profile.setEmployeeNo("EMP-1");
        when(mapper.selectProfileByUserId("user-1")).thenReturn(profile);
        when(mapper.updateOwnContactInfo(eq("user-1"), any(MyProfileDto.ContactUpdate.class))).thenReturn(1);
        MyProfileService service = new MyProfileService(mapper);
        MyProfileDto.ContactUpdate contact = new MyProfileDto.ContactUpdate();
        contact.setEmail(" person@example.com ");
        contact.setPhone(" 01012345678 ");
        contact.setPostalCode(" ");
        contact.setAddressLine1(" Main Street ");
        contact.setAddressLine2(null);

        service.updateOwnContactInfo("user-1", contact);

        assertThat(contact.getEmail()).isEqualTo("person@example.com");
        assertThat(contact.getPhone()).isEqualTo("01012345678");
        assertThat(contact.getPostalCode()).isNull();
        assertThat(contact.getAddressLine1()).isEqualTo("Main Street");
        assertThat(contact.getAddressLine2()).isNull();
        verify(mapper).updateOwnContactInfo("user-1", contact);
    }

    @Test
    void invalidContactEmailIsRejectedBeforeAnyDatabaseAccess() {
        MyProfileMapper mapper = mock(MyProfileMapper.class);
        MyProfileService service = new MyProfileService(mapper);
        MyProfileDto.ContactUpdate contact = new MyProfileDto.ContactUpdate();
        contact.setEmail("invalid-email");
        contact.setPhone("01012345678");

        assertThatThrownBy(() -> service.updateOwnContactInfo("user-1", contact))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(error -> assertThat(((ResponseStatusException) error).getStatusCode().value())
                        .isEqualTo(400));

        verifyNoMoreInteractions(mapper);
    }
}
