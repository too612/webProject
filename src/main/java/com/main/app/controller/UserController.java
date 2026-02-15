package com.main.app.controller;

import com.main.app.model.UserDto;
import com.main.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import jakarta.servlet.http.HttpSession;
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
    public String loginPage(Model model, @RequestParam(required = false) String error) {
        if ("true".equals(error)) {
            model.addAttribute("error", true);
            model.addAttribute("errorMessage", "아이디 또는 비밀번호가 올바르지 않습니다.");
        }
        return "user/login";
    }
    
    /**
     * 로그인 처리
     */
    @PostMapping("/login")
    public String login(@RequestParam String userId, 
                       @RequestParam String password,
                       @RequestParam(required = false) String rememberMe,
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
            redirectAttributes.addFlashAttribute("errorMessage", "계정이 잠겨있습니다. 잠시 후 다시 시도해주세요.");
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
        return "user/register";
    }
    
    /**
     * 회원가입 처리
     */
    @PostMapping("/register")
    public String register(@ModelAttribute UserDto user,
                          RedirectAttributes redirectAttributes) {
        
        // 중복 체크
        if (!userService.isUserIdAvailable(user.getUserId())) {
            redirectAttributes.addFlashAttribute("error", true);
            redirectAttributes.addFlashAttribute("errorMessage", "이미 사용중인 아이디입니다.");
            return "redirect:/user/register";
        }
        
        if (!userService.isEmailAvailable(user.getEmail())) {
            redirectAttributes.addFlashAttribute("error", true);
            redirectAttributes.addFlashAttribute("errorMessage", "이미 사용중인 이메일입니다.");
            return "redirect:/user/register";
        }
        
        // 회원 가입 처리
        boolean result = userService.registerUser(user);
        
        if (result) {
            redirectAttributes.addFlashAttribute("success", true);
            redirectAttributes.addFlashAttribute("successMessage", "회원가입이 완료되었습니다. 로그인해주세요.");
            return "redirect:/user/login";
        } else {
            redirectAttributes.addFlashAttribute("error", true);
            redirectAttributes.addFlashAttribute("errorMessage", "회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
            return "redirect:/user/register";
        }
    }
    
    /**
     * 아이디 중복 체크 (AJAX)
     */
    @GetMapping("/check-userid")
    @ResponseBody
    public Map<String, Boolean> checkUserId(@RequestParam String userId) {
        Map<String, Boolean> result = new HashMap<>();
        result.put("available", userService.isUserIdAvailable(userId));
        return result;
    }
    
    /**
     * 이메일 중복 체크 (AJAX)
     */
    @GetMapping("/check-email")
    @ResponseBody
    public Map<String, Boolean> checkEmail(@RequestParam String email) {
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
        
        return "user/mypage";
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
    public String changePassword(@RequestParam String currentPassword,
                                @RequestParam String newPassword,
                                HttpSession session,
                                RedirectAttributes redirectAttributes) {
        
        UserDto loginUser = (UserDto) session.getAttribute("loginUser");
        
        if (loginUser == null) {
            return "redirect:/user/login";
        }
        
        boolean result = userService.changePassword(loginUser.getUserId(), currentPassword, newPassword);
        
        if (result) {
            redirectAttributes.addFlashAttribute("success", true);
            redirectAttributes.addFlashAttribute("successMessage", "비밀번호가 변경되었습니다. 다시 로그인해주세요.");
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
}
