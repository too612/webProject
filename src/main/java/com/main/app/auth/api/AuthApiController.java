package com.main.app.auth.api;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.main.app.auth.dto.UserDto;
import com.main.app.auth.service.UserService;
import com.main.app.common.dto.ApiResponse;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/auth")
public class AuthApiController {

    private final UserService userService;

    public AuthApiController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@RequestBody LoginRequest request,
            HttpSession session) {
        UserDto user = userService.login(request.getUsername(), request.getPassword());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.fail(HttpStatus.UNAUTHORIZED.value(), "아이디 또는 비밀번호가 올바르지 않습니다."));
        }

        if ("I".equals(user.getStatus())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.fail(HttpStatus.FORBIDDEN.value(), "잠긴 계정입니다."));
        }

        session.setAttribute("loginUser", user);
        session.setAttribute("userId", user.getUserId());
        session.setAttribute("userName", user.getUserName());

        if (Boolean.TRUE.equals(request.getRememberMe())) {
            session.setMaxInactiveInterval(60 * 60 * 24 * 7);
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("userId", user.getUserId());
        payload.put("username", user.getUserName() == null ? user.getUserId() : user.getUserName());
        payload.put("token", null);

        return ResponseEntity.ok(ApiResponse.ok(payload, "로그인되었습니다."));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Map<String, Object>>> register(@RequestBody RegisterRequest request) {
        if (request.getUsername() == null || request.getUsername().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.fail(HttpStatus.BAD_REQUEST.value(), "아이디는 필수입니다."));
        }
        if (request.getUserName() == null || request.getUserName().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.fail(HttpStatus.BAD_REQUEST.value(), "이름은 필수입니다."));
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.fail(HttpStatus.BAD_REQUEST.value(), "비밀번호는 필수입니다."));
        }
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.fail(HttpStatus.BAD_REQUEST.value(), "이메일은 필수입니다."));
        }
        if (request.getPhone() == null || request.getPhone().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.fail(HttpStatus.BAD_REQUEST.value(), "휴대폰 번호는 필수입니다."));
        }
        if (!Boolean.TRUE.equals(request.getAgreeTerms()) || !Boolean.TRUE.equals(request.getAgreePrivacy())) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.fail(HttpStatus.BAD_REQUEST.value(), "필수 약관 동의가 필요합니다."));
        }

        if (!userService.isUserIdAvailable(request.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.fail(HttpStatus.CONFLICT.value(), "이미 사용 중인 아이디입니다."));
        }

        if (!userService.isEmailAvailable(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.fail(HttpStatus.CONFLICT.value(), "이미 사용 중인 이메일입니다."));
        }

        UserDto user = new UserDto();
        user.setUserId(request.getUsername());
        user.setUserName(request.getUserName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(request.getPassword());
        user.setBirthDate(request.getBirthDate());
        user.setGender(request.getGender());
        user.setAgreeTerms(Boolean.TRUE.equals(request.getAgreeTerms()));
        user.setAgreePrivacy(Boolean.TRUE.equals(request.getAgreePrivacy()));
        user.setAgreeMarketing(Boolean.TRUE.equals(request.getAgreeMarketing()));

        boolean registered = userService.registerUser(user);
        if (!registered) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.fail(HttpStatus.INTERNAL_SERVER_ERROR.value(), "회원가입 처리에 실패했습니다."));
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("userId", user.getUserId());
        payload.put("username", user.getUserName());
        payload.put("token", null);
        return ResponseEntity.ok(ApiResponse.ok(payload, "회원가입이 완료되었습니다."));
    }

    @GetMapping("/check-userid")
    public ApiResponse<Map<String, Boolean>> checkUserId(String userId) {
        Map<String, Boolean> payload = new HashMap<>();
        payload.put("available", userService.isUserIdAvailable(userId));
        return ApiResponse.ok(payload);
    }

    @GetMapping("/check-email")
    public ApiResponse<Map<String, Boolean>> checkEmail(String email) {
        Map<String, Boolean> payload = new HashMap<>();
        payload.put("available", userService.isEmailAvailable(email));
        return ApiResponse.ok(payload);
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> me(HttpSession session) {
        Object sessionUserId = session.getAttribute("userId");
        if (sessionUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.fail(HttpStatus.UNAUTHORIZED.value(), "로그인이 필요합니다."));
        }

        UserDto user = userService.getUserByUserId(String.valueOf(sessionUserId));
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.fail(HttpStatus.NOT_FOUND.value(), "사용자 정보를 찾을 수 없습니다."));
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("userId", user.getUserId());
        payload.put("username", user.getUserName());
        payload.put("email", user.getEmail());
        payload.put("status", user.getStatus());
        return ResponseEntity.ok(ApiResponse.ok(payload));
    }

    @GetMapping("/check")
    public ApiResponse<Map<String, Boolean>> check(HttpSession session) {
        Map<String, Boolean> payload = new HashMap<>();
        payload.put("authenticated", session.getAttribute("userId") != null);
        return ApiResponse.ok(payload);
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(HttpSession session) {
        session.invalidate();
        return ApiResponse.ok(null, "로그아웃되었습니다.");
    }

    public static class LoginRequest {
        private String username;
        private String password;
        private Boolean rememberMe;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public Boolean getRememberMe() {
            return rememberMe;
        }

        public void setRememberMe(Boolean rememberMe) {
            this.rememberMe = rememberMe;
        }
    }

    public static class RegisterRequest {
        private String username;
        private String userName;
        private String email;
        private String phone;
        private String password;
        private LocalDate birthDate;
        private String gender;
        private Boolean agreeTerms;
        private Boolean agreePrivacy;
        private Boolean agreeMarketing;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getUserName() {
            return userName;
        }

        public void setUserName(String userName) {
            this.userName = userName;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public LocalDate getBirthDate() {
            return birthDate;
        }

        public void setBirthDate(LocalDate birthDate) {
            this.birthDate = birthDate;
        }

        public String getGender() {
            return gender;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }

        public Boolean getAgreeTerms() {
            return agreeTerms;
        }

        public void setAgreeTerms(Boolean agreeTerms) {
            this.agreeTerms = agreeTerms;
        }

        public Boolean getAgreePrivacy() {
            return agreePrivacy;
        }

        public void setAgreePrivacy(Boolean agreePrivacy) {
            this.agreePrivacy = agreePrivacy;
        }

        public Boolean getAgreeMarketing() {
            return agreeMarketing;
        }

        public void setAgreeMarketing(Boolean agreeMarketing) {
            this.agreeMarketing = agreeMarketing;
        }
    }
}