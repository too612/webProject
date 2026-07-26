package com.main.app.common.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.main.app.common.auth.dto.UserDto;
import com.main.app.common.auth.dto.TermsPolicyDto;
import com.main.app.common.dto.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.Clock;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private static final String FIND_ID_CODE_KEY = "auth.findId.code";
    private static final String FIND_ID_EXPIRE_KEY = "auth.findId.expireAt";
    private static final String FIND_ID_RESULT_KEY = "auth.findId.maskedUserId";
    private static final String FIND_PASSWORD_CODE_KEY = "auth.findPassword.code";
    private static final String FIND_PASSWORD_EXPIRE_KEY = "auth.findPassword.expireAt";
    private static final String FIND_PASSWORD_USER_KEY = "auth.findPassword.userId";
    private static final String FIND_PASSWORD_VERIFIED_KEY = "auth.findPassword.verified";
    private static final int RECOVERY_CODE_EXPIRE_MINUTES = 10;
    private static final Clock SYSTEM_CLOCK = Clock.systemDefaultZone();
    private static final String SESSION_USER_ID_KEY = "userId";
    private static final String SESSION_USER_NAME_KEY = "userName";
    private static final String PAYLOAD_USER_ID_KEY = "userId";
    private static final String PAYLOAD_USERNAME_KEY = "username";
    private static final Pattern PASSWORD_PATTERN = Pattern
            .compile("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[^A-Za-z\\d]).{8,20}$");

    private final UserService userService;
    private final AuthMailService authMailService;

    public AuthController(UserService userService, AuthMailService authMailService) {
        this.userService = userService;
        this.authMailService = authMailService;
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
        session.setAttribute(SESSION_USER_ID_KEY, user.getUserId());
        session.setAttribute(SESSION_USER_NAME_KEY, user.getUserName());

        if (Boolean.TRUE.equals(request.getRememberMe())) {
            session.setMaxInactiveInterval(60 * 60 * 24 * 7);
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put(PAYLOAD_USER_ID_KEY, user.getUserId());
        payload.put(PAYLOAD_USERNAME_KEY, user.getUserName() == null ? user.getUserId() : user.getUserName());
        payload.put("token", null);

        return ResponseEntity.ok(ApiResponse.ok(payload, "로그인되었습니다."));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Map<String, Object>>> register(
            @RequestBody RegisterRequest request,
            HttpServletRequest httpServletRequest) {
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
                    .body(ApiResponse.fail(HttpStatus.BAD_REQUEST.value(), "전화번호는 필수입니다."));
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
        user.setPostalCode(request.getPostalCode());
        user.setAddressLine1(request.getAddressLine1());
        user.setAddressLine2(request.getAddressLine2());
        user.setPassword(request.getPassword());
        user.setBirthDate(request.getBirthDate());
        user.setGender(request.getGender());
        user.setAgreeTerms(Boolean.TRUE.equals(request.getAgreeTerms()));
        user.setAgreePrivacy(Boolean.TRUE.equals(request.getAgreePrivacy()));
        user.setAgreeMarketing(Boolean.TRUE.equals(request.getAgreeMarketing()));

        String consentIp = resolveClientIp(httpServletRequest);
        String userAgent = httpServletRequest.getHeader("User-Agent");

        boolean registered = userService.registerUser(user, consentIp, userAgent);
        if (!registered) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.fail(HttpStatus.INTERNAL_SERVER_ERROR.value(), "회원가입 처리에 실패했습니다."));
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put(PAYLOAD_USER_ID_KEY, user.getUserId());
        payload.put(PAYLOAD_USERNAME_KEY, user.getUserName());
        payload.put("token", null);
        return ResponseEntity.ok(ApiResponse.ok(payload, "회원가입이 완료되었습니다."));
    }

    private String resolveClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isBlank()) {
            return xRealIp.trim();
        }

        return request.getRemoteAddr();
    }

    @GetMapping("/check-userid")
    public ApiResponse<Map<String, Boolean>> checkUserId(@RequestParam String userId) {
        Map<String, Boolean> payload = new HashMap<>();
        payload.put("available", userService.isUserIdAvailable(userId));
        return ApiResponse.ok(payload);
    }

    @GetMapping("/check-email")
    public ApiResponse<Map<String, Boolean>> checkEmail(@RequestParam String email) {
        Map<String, Boolean> payload = new HashMap<>();
        payload.put("available", userService.isEmailAvailable(email));
        return ApiResponse.ok(payload);
    }

    @GetMapping("/terms/active")
    public ApiResponse<Map<String, TermsPolicyDto>> getActiveTermsPolicies() {
        return ApiResponse.ok(userService.getActiveTermsPolicyMap());
    }

    @PostMapping("/find-id/send-code")
        public ApiResponse<Map<String, Object>> sendFindIdCode(
            @RequestBody FindIdSendCodeRequest request,
            HttpSession session,
            HttpServletRequest httpServletRequest) {
        if (request.getName() == null || request.getName().isBlank() || request.getEmail() == null
                || request.getEmail().isBlank()) {
            return ApiResponse.fail(HttpStatus.BAD_REQUEST.value(), "이름과 이메일을 입력해주세요.");
        }

        String normalizedName = request.getName().trim();
        String normalizedEmail = request.getEmail().trim();
        String code = generateVerificationCode();
        LocalDateTime expireAt = LocalDateTime.now(SYSTEM_CLOCK).plusMinutes(RECOVERY_CODE_EXPIRE_MINUTES);

        UserDto user = userService.getUserByNameAndEmail(normalizedName, normalizedEmail);
        if (user != null) {
            session.setAttribute(FIND_ID_RESULT_KEY, user.getUserId());
        } else {
            session.removeAttribute(FIND_ID_RESULT_KEY);
        }

        session.setAttribute(FIND_ID_CODE_KEY, code);
        session.setAttribute(FIND_ID_EXPIRE_KEY, expireAt);

        try {
            authMailService.sendFindIdCode(normalizedEmail, code);
        } catch (Exception e) {
            log.error("아이디 찾기 메일 발송 실패. email={}", normalizedEmail, e);
            return ApiResponse.fail(HttpStatus.INTERNAL_SERVER_ERROR.value(), "인증코드 메일 발송에 실패했습니다.");
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("expiresInMinutes", RECOVERY_CODE_EXPIRE_MINUTES);
        return ApiResponse.ok(payload, "입력 정보가 일치하면 인증코드를 발송합니다.");
    }

    @PostMapping("/find-id/verify-code")
    public ApiResponse<Map<String, Object>> verifyFindIdCode(@RequestBody VerifyCodeRequest request, HttpSession session) {
        if (!isValidSessionCode(session, FIND_ID_CODE_KEY, FIND_ID_EXPIRE_KEY, request.getCode())) {
            return ApiResponse.fail(HttpStatus.BAD_REQUEST.value(), "인증코드가 올바르지 않거나 만료되었습니다.");
        }

        String foundUserId = (String) session.getAttribute(FIND_ID_RESULT_KEY);
        session.removeAttribute(FIND_ID_CODE_KEY);
        session.removeAttribute(FIND_ID_EXPIRE_KEY);

        Map<String, Object> payload = new HashMap<>();
        payload.put("userId", foundUserId == null ? "일치하는 계정을 찾을 수 없습니다." : foundUserId);
        return ApiResponse.ok(payload, "아이디 확인이 완료되었습니다.");
    }

    @PostMapping("/find-password/send-code")
    public ApiResponse<Map<String, Object>> sendFindPasswordCode(@RequestBody FindPasswordSendCodeRequest request,
            HttpSession session,
            HttpServletRequest httpServletRequest) {
        if (request.getUserId() == null || request.getUserId().isBlank() || request.getEmail() == null
                || request.getEmail().isBlank()) {
            return ApiResponse.fail(HttpStatus.BAD_REQUEST.value(), "아이디와 이메일을 입력해주세요.");
        }

        String normalizedUserId = request.getUserId().trim();
        String normalizedEmail = request.getEmail().trim();
        String code = generateVerificationCode();
        LocalDateTime expireAt = LocalDateTime.now(SYSTEM_CLOCK).plusMinutes(RECOVERY_CODE_EXPIRE_MINUTES);

        UserDto user = userService.getUserByUserIdAndEmail(normalizedUserId, normalizedEmail);
        if (user != null) {
            session.setAttribute(FIND_PASSWORD_USER_KEY, user.getUserId());
        } else {
            session.removeAttribute(FIND_PASSWORD_USER_KEY);
        }
        session.removeAttribute(FIND_PASSWORD_VERIFIED_KEY);
        session.setAttribute(FIND_PASSWORD_CODE_KEY, code);
        session.setAttribute(FIND_PASSWORD_EXPIRE_KEY, expireAt);

        try {
            authMailService.sendFindPasswordCode(normalizedEmail, code);
        } catch (Exception e) {
            log.error("비밀번호 찾기 메일 발송 실패. email={}", normalizedEmail, e);
            return ApiResponse.fail(HttpStatus.INTERNAL_SERVER_ERROR.value(), "인증코드 메일 발송에 실패했습니다.");
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("expiresInMinutes", RECOVERY_CODE_EXPIRE_MINUTES);
        return ApiResponse.ok(payload, "입력 정보가 일치하면 인증코드를 발송합니다.");
    }

    @PostMapping("/find-password/verify-code")
    public ApiResponse<Map<String, Boolean>> verifyFindPasswordCode(@RequestBody VerifyCodeRequest request,
            HttpSession session) {
        if (!isValidSessionCode(session, FIND_PASSWORD_CODE_KEY, FIND_PASSWORD_EXPIRE_KEY, request.getCode())) {
            return ApiResponse.fail(HttpStatus.BAD_REQUEST.value(), "인증코드가 올바르지 않거나 만료되었습니다.");
        }

        String verifiedUserId = (String) session.getAttribute(FIND_PASSWORD_USER_KEY);
        if (verifiedUserId == null || verifiedUserId.isBlank()) {
            return ApiResponse.fail(HttpStatus.BAD_REQUEST.value(), "입력 정보와 일치하는 계정을 찾을 수 없습니다.");
        }

        session.removeAttribute(FIND_PASSWORD_CODE_KEY);
        session.removeAttribute(FIND_PASSWORD_EXPIRE_KEY);
        session.setAttribute(FIND_PASSWORD_VERIFIED_KEY, Boolean.TRUE);

        Map<String, Boolean> payload = new HashMap<>();
        payload.put("verified", true);
        return ApiResponse.ok(payload, "본인 인증이 완료되었습니다.");
    }

    @PostMapping("/find-password/reset")
    public ApiResponse<Map<String, Boolean>> resetPasswordByRecovery(@RequestBody ResetPasswordRequest request,
            HttpSession session) {
        if (!Boolean.TRUE.equals(session.getAttribute(FIND_PASSWORD_VERIFIED_KEY))) {
            return ApiResponse.fail(HttpStatus.BAD_REQUEST.value(), "비밀번호 재설정 인증이 필요합니다.");
        }

        if (request.getNewPassword() == null || !PASSWORD_PATTERN.matcher(request.getNewPassword()).matches()) {
            return ApiResponse.fail(HttpStatus.BAD_REQUEST.value(), "비밀번호는 8-20자의 영문, 숫자, 특수문자 조합이어야 합니다.");
        }

        if (request.getConfirmPassword() == null || !request.getNewPassword().equals(request.getConfirmPassword())) {
            return ApiResponse.fail(HttpStatus.BAD_REQUEST.value(), "비밀번호 확인이 일치하지 않습니다.");
        }

        String verifiedUserId = (String) session.getAttribute(FIND_PASSWORD_USER_KEY);
        if (verifiedUserId == null || verifiedUserId.isBlank()) {
            return ApiResponse.fail(HttpStatus.BAD_REQUEST.value(), "재설정 대상 계정을 찾을 수 없습니다.");
        }

        boolean updated = userService.resetPassword(verifiedUserId, request.getNewPassword());
        if (!updated) {
            return ApiResponse.fail(HttpStatus.INTERNAL_SERVER_ERROR.value(), "비밀번호 재설정에 실패했습니다.");
        }

        session.removeAttribute(FIND_PASSWORD_VERIFIED_KEY);
        session.removeAttribute(FIND_PASSWORD_USER_KEY);

        Map<String, Boolean> payload = new HashMap<>();
        payload.put("updated", true);
        return ApiResponse.ok(payload, "비밀번호가 변경되었습니다.");
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> me(HttpSession session) {
        Object sessionUserId = session.getAttribute(SESSION_USER_ID_KEY);
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
        payload.put(PAYLOAD_USER_ID_KEY, user.getUserId());
        payload.put(PAYLOAD_USERNAME_KEY, user.getUserName());
        payload.put("email", user.getEmail());
        payload.put("status", user.getStatus());
        return ResponseEntity.ok(ApiResponse.ok(payload));
    }

    @GetMapping("/check")
    public ApiResponse<Map<String, Boolean>> check(HttpSession session) {
        Map<String, Boolean> payload = new HashMap<>();
        payload.put("authenticated", session.getAttribute(SESSION_USER_ID_KEY) != null);
        return ApiResponse.ok(payload);
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(HttpSession session) {
        session.invalidate();
        return ApiResponse.ok(null, "로그아웃되었습니다.");
    }

    private String generateVerificationCode() {
        return String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));
    }

    private boolean isValidSessionCode(HttpSession session, String codeKey, String expireKey, String inputCode) {
        Object savedCode = session.getAttribute(codeKey);
        Object expireAtObj = session.getAttribute(expireKey);

        if (!(savedCode instanceof String) || !(expireAtObj instanceof LocalDateTime) || inputCode == null) {
            return false;
        }

        LocalDateTime expireAt = (LocalDateTime) expireAtObj;
        if (LocalDateTime.now(SYSTEM_CLOCK).isAfter(expireAt)) {
            return false;
        }

        return ((String) savedCode).equals(inputCode.trim());
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
        private String postalCode;
        private String addressLine1;
        private String addressLine2;
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

        public String getPostalCode() {
            return postalCode;
        }

        public void setPostalCode(String postalCode) {
            this.postalCode = postalCode;
        }

        public String getAddressLine1() {
            return addressLine1;
        }

        public void setAddressLine1(String addressLine1) {
            this.addressLine1 = addressLine1;
        }

        public String getAddressLine2() {
            return addressLine2;
        }

        public void setAddressLine2(String addressLine2) {
            this.addressLine2 = addressLine2;
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

    public static class FindIdSendCodeRequest {
        @JsonProperty("userName")
        private String name;
        private String email;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }

    public static class FindPasswordSendCodeRequest {
        private String userId;
        private String email;

        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }

    public static class VerifyCodeRequest {
        private String code;

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }
    }

    public static class ResetPasswordRequest {
        private String newPassword;
        private String confirmPassword;

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }

        public String getConfirmPassword() {
            return confirmPassword;
        }

        public void setConfirmPassword(String confirmPassword) {
            this.confirmPassword = confirmPassword;
        }
    }
}
