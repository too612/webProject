package com.main.app.erp.humen.myprofile;

import com.main.app.erp.humen.myprofile.dto.MyProfileDto;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;

class MyProfileControllerTest {

    @Test
    void unauthenticatedRequestsDoNotReachTheService() {
        MyProfileService service = mock(MyProfileService.class);
        MyProfileController controller = new MyProfileController(service);
        MockHttpServletRequest request = new MockHttpServletRequest();

        controller.getMyProfile(request);
        controller.updateOwnContactInfo(request, new MyProfileDto.ContactUpdate());

        verifyNoInteractions(service);
    }

    @Test
    void requestsUseTheSessionUserInsteadOfClientSuppliedIdentity() {
        MyProfileService service = mock(MyProfileService.class);
        MyProfileController controller = new MyProfileController(service);
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.getSession().setAttribute("userId", "session-user");

        controller.getMyProfile(request);
        controller.updateOwnContactInfo(request, new MyProfileDto.ContactUpdate());

        verify(service).getMyProfile("session-user");
        verify(service).updateOwnContactInfo(eq("session-user"), any(MyProfileDto.ContactUpdate.class));
    }
}
