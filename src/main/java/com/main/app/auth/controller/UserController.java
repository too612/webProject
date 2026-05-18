package com.main.app.auth.controller;

import com.main.app.auth.dto.UserDto;
import com.main.app.auth.service.UserService;
import com.main.app.common.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import jakarta.servlet.http.HttpSession;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * 로그인 페이지
     */
    @GetMapping("/login")
    public String loginPage(Model model, @RequestParam(name = "error", required = false) String error) {
        if ("true".equals(error)) {
            model.addAttribute("error", true);
            model.addAttribute("errorMessage", "아이디 또는 비밀번호가 올바르지 않습니다.");
        }
        return "auth/user/login";
    }

    /**
     * 로그인 처리
     */
    @PostMapping("/login")
    public String login(@RequestParam("userId") String userId,
            @RequestParam("password") String password,
            @RequestParam(name = "rememberMe", required = false) String rememberMe,
            HttpSession session,
            RedirectAttributes redirectAttributes) {

        UserDto user = userService.login(userId, password);

        if (user == null) {
            redirectAttributes.addFlashAttribute("error", true);
            redirectAttributes.addFlashAttribute("errorMessage", "아이디 또는 비밀번호가 올바르지 않습니다.");
            return "redirect:/user/login?error=true";
        }

        // 계정 상태 확인
        if ("I".equals(user.getStatus())) {
            redirectAttributes.addFlashAttribute("error", true);
            redirectAttributes.addFlashAttribute("errorMessage", "계정이 잠겨 있습니다. 잠시 후 다시 시도해 주세요.");
            return "redirect:/user/login?error=true";
        }

        // 세션에 사용자 정보 저장
        session.setAttribute("loginUser", user);
        session.setAttribute("userId", user.getUserId());
        session.setAttribute("userName", user.getUserName());

        // 로그인 상태 유지 설정
        if ("on".equals(rememberMe)) {
            session.setMaxInactiveInterval(60 * 60 * 24 * 7); // 7일
        }

        return "redirect:/";
    }

    /**
     * 로그아웃
     */
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/";
    }

    /**
     * 회원가입 페이지
     */
    @GetMapping("/register")
    public String registerPage(Model model) {
        return "auth/user/register";
    }

    /**
     * 회원가입 처리
     */
    @PostMapping("/register")
    public String register(@ModelAttribute UserDto user,
            RedirectAttributes redirectAttributes) {

        System.out.println("\n========== 회원가입 컨트롤러 호출 ==========");
        System.out.println("[요청 데이터]");
        System.out.println("- userId: " + user.getUserId());
        System.out.println("- userName: " + user.getUserName());
        System.out.println("- email: " + user.getEmail());
        System.out.println("- phone: " + user.getPhone());
        System.out.println("- birthDate: " + user.getBirthDate());
        System.out.println("- gender: " + user.getGender());
        System.out.println(
                "password provided: " + (user.getPassword() != null && !user.getPassword().isEmpty() ? "yes" : "no"));
        System.out.println("- agreeTerms: " + user.getAgreeTerms());
        System.out.println("- agreePrivacy: " + user.getAgreePrivacy());
        System.out.println("- agreeMarketing: " + user.getAgreeMarketing());

        // 중복 체크
        if (!userService.isUserIdAvailable(user.getUserId())) {
            System.out.println("[회원가입 실패] 이미 사용 중인 아이디: " + user.getUserId());
            redirectAttributes.addFlashAttribute("error", true);
            redirectAttributes.addFlashAttribute("errorMessage", "이미 사용 중인 아이디입니다.");
            return "redirect:/user/register";
        }

        if (!userService.isEmailAvailable(user.getEmail())) {
            System.out.println("[회원가입 실패] 이미 사용 중인 이메일: " + user.getEmail());
            redirectAttributes.addFlashAttribute("error", true);
            redirectAttributes.addFlashAttribute("errorMessage", "이미 사용 중인 이메일입니다.");
            return "redirect:/user/register";
        }

        System.out.println("[회원가입] 중복 확인 통과, 서비스 호출...");

        // 회원 가입 처리
        boolean result = userService.registerUser(user);

        if (result) {
            System.out.println("[회원가입 성공] User ID: " + user.getUserId());
            redirectAttributes.addFlashAttribute("success", true);
            redirectAttributes.addFlashAttribute("successMessage", "회원가입이 완료되었습니다. 로그인해 주세요.");
            return "redirect:/user/login";
        } else {
            System.out.println("[회원가입 실패] 데이터베이스 저장 오류");
            redirectAttributes.addFlashAttribute("error", true);
            redirectAttributes.addFlashAttribute("errorMessage", "회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.");
            return "redirect:/user/register";
        }
    }

    /**
     * 아이디 중복 체크 (AJAX)
     */
    @GetMapping("/check-userid")
    @ResponseBody
    public Map<String, Boolean> checkUserId(@RequestParam("userId") String userId) {
        Map<String, Boolean> result = new HashMap<>();
        result.put("available", userService.isUserIdAvailable(userId));
        return result;
    }

    /**
     * 이메일 중복 체크 (AJAX)
     */
    @GetMapping("/check-email")
    @ResponseBody
    public Map<String, Boolean> checkEmail(@RequestParam("email") String email) {
        Map<String, Boolean> result = new HashMap<>();
        result.put("available", userService.isEmailAvailable(email));
        return result;
    }

    /**
     * 마이페이지
     */
    @GetMapping("/mypage")
    public String myPage(HttpSession session, Model model) {
        UserDto loginUser = (UserDto) session.getAttribute("loginUser");

        if (loginUser == null) {
            return "redirect:/user/login";
        }

        // 최신 사용자 정보 조회
        UserDto user = userService.getUserByUserId(loginUser.getUserId());
        model.addAttribute("user", user);

        return "auth/user/mypage";
    }

    /**
     * 회원정보 수정 처리
     */
    @PostMapping("/update")
    public String updateUser(@ModelAttribute UserDto user,
            HttpSession session,
            RedirectAttributes redirectAttributes) {

        UserDto loginUser = (UserDto) session.getAttribute("loginUser");

        if (loginUser == null) {
            return "redirect:/user/login";
        }

        // 본인 정보만 수정 가능
        user.setUserId(loginUser.getUserId());

        boolean result = userService.updateUser(user);

        if (result) {
            // 세션 정보 갱신
            UserDto updatedUser = userService.getUserByUserId(loginUser.getUserId());
            session.setAttribute("loginUser", updatedUser);
            session.setAttribute("userName", updatedUser.getUserName());

            redirectAttributes.addFlashAttribute("success", true);
            redirectAttributes.addFlashAttribute("successMessage", "회원정보가 수정되었습니다.");
        } else {
            redirectAttributes.addFlashAttribute("error", true);
            redirectAttributes.addFlashAttribute("errorMessage", "회원정보 수정 중 오류가 발생했습니다.");
        }

        return "redirect:/user/mypage";
    }

    /**
     * 비밀번호 변경 페이지
     */
    @GetMapping("/change-password")
    public String changePasswordPage(HttpSession session) {
        UserDto loginUser = (UserDto) session.getAttribute("loginUser");

        if (loginUser == null) {
            return "redirect:/user/login";
        }

        return "user/change-password";
    }

    /**
     * 비밀번호 변경 처리
     */
    @PostMapping("/change-password")
    public String changePassword(@RequestParam("currentPassword") String currentPassword,
            @RequestParam("newPassword") String newPassword,
            HttpSession session,
            RedirectAttributes redirectAttributes) {

        UserDto loginUser = (UserDto) session.getAttribute("loginUser");

        if (loginUser == null) {
            return "redirect:/user/login";
        }

        boolean result = userService.changePassword(loginUser.getUserId(), currentPassword, newPassword);

        if (result) {
            redirectAttributes.addFlashAttribute("success", true);
            redirectAttributes.addFlashAttribute("successMessage", "비밀번호가 변경되었습니다. 다시 로그인해 주세요.");
            session.invalidate();
            return "redirect:/user/login";
        } else {
            redirectAttributes.addFlashAttribute("error", true);
            redirectAttributes.addFlashAttribute("errorMessage", "현재 비밀번호가 일치하지 않습니다.");
            return "redirect:/user/change-password";
        }
    }

    /**
     * 아이디 찾기 페이지
     */
    @GetMapping("/find-id")
    public String findIdPage() {
        return "user/find-id";
    }

    /**
     * 비밀번호 찾기 페이지
     */
    @GetMapping("/find-password")
    public String findPasswordPage() {
        return "user/find-password";
    }

    // ===== REST API 메서드 (AuthController에서 통합) =====

    /**
     * API 로그인(JSON)
     */
    @PostMapping("/api/auth/login")
    @ResponseBody
    public ResponseEntity<ApiResponse<Map<String, Object>>> apiLogin(@RequestBody LoginRequest request,
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

    /**
     * API 회원가입(JSON)
     */
    @PostMapping("/api/auth/register")
    @ResponseBody
    public ResponseEntity<ApiResponse<Map<String, Object>>> apiRegister(@RequestBody RegisterRequest request) {
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

    /**
     * API 아이디 중복 체크
     */
    @GetMapping("/api/auth/check-userid")
    @ResponseBody
    public ApiResponse<Map<String, Boolean>> apiCheckUserId(@RequestParam String userId) {
        Map<String, Boolean> payload = new HashMap<>();
        payload.put("available", userService.isUserIdAvailable(userId));
        return ApiResponse.ok(payload);
    }

    /**
     * API 이메일 중복 체크
     */
    @GetMapping("/api/auth/check-email")
    @ResponseBody
    public ApiResponse<Map<String, Boolean>> apiCheckEmail(@RequestParam String email) {
        Map<String, Boolean> payload = new HashMap<>();
        payload.put("available", userService.isEmailAvailable(email));
        return ApiResponse.ok(payload);
    }

    /**
     * API 현재 사용자 정보 조회
     */
    @GetMapping("/api/auth/me")
    @ResponseBody
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

    /**
     * API 인증 상태 확인
     */
    @GetMapping("/api/auth/check")
    @ResponseBody
    public ApiResponse<Map<String, Boolean>> check(HttpSession session) {
        Map<String, Boolean> payload = new HashMap<>();
        payload.put("authenticated", session.getAttribute("userId") != null);
        return ApiResponse.ok(payload);
    }

    /**
     * API 로그아웃
     */
    @PostMapping("/api/auth/logout")
    @ResponseBody
    public ApiResponse<Void> apiLogout(HttpSession session) {
        session.invalidate();
        return ApiResponse.ok(null, "로그아웃되었습니다.");
    }

    // ===== Inner Classes (Request DTOs) =====

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
