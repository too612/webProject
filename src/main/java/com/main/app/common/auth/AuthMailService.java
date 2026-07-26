package com.main.app.common.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class AuthMailService {

    private final JavaMailSender mailSender;
    private final String fromAddress;

    public AuthMailService(
            JavaMailSender mailSender,
            @Value("${app.mail.from:no-reply@local.test}") String fromAddress) {
        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
    }

    public void sendFindIdCode(String to, String code) {
                sendCodeMail(to, "[다사랑교회] 아이디 찾기 인증코드 안내", code, "아이디 찾기");
    }

    public void sendFindPasswordCode(String to, String code) {
                sendCodeMail(to, "[다사랑교회] 비밀번호 재설정 인증코드 안내", code, "비밀번호 재설정");
    }

        private void sendCodeMail(String to, String subject, String code, String purpose) {
                try {
                        MimeMessage message = mailSender.createMimeMessage();
                        MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");
                        helper.setFrom(fromAddress);
                        helper.setTo(to);
                        helper.setSubject(subject);
                        helper.setText(buildMailBody(code, purpose), true);
                        mailSender.send(message);
                } catch (Exception e) {
                        throw new IllegalStateException("메일 발송 처리 중 오류가 발생했습니다.", e);
                }
    }

        private String buildMailBody(String code, String purpose) {
                return """
                                <div style=\"margin:0;padding:0;background:#f8fafc;font-family:'Noto Sans KR',Arial,sans-serif;\">
                                    <div style=\"max-width:560px;margin:0 auto;padding:28px 16px;\">
                                        <div style=\"background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;\">
                                            <div style=\"padding:18px 20px;background:linear-gradient(135deg,#0f766e,#0ea5e9);color:#ffffff;\">
                                                <h2 style=\"margin:0;font-size:18px;line-height:1.4;\">다사랑교회 계정 인증 안내</h2>
                                            </div>
                                            <div style=\"padding:20px;color:#0f172a;\">
                                                <p style=\"margin:0 0 14px;font-size:14px;line-height:1.7;\">요청하신 %s 인증코드를 안내드립니다.</p>
                                                <div style=\"margin:0 0 14px;padding:16px;border-radius:10px;background:#f1f5f9;border:1px dashed #94a3b8;text-align:center;\">
                                                    <div style=\"font-size:12px;color:#64748b;margin-bottom:8px;\">인증코드</div>
                                                    <div style=\"font-size:30px;font-weight:700;letter-spacing:6px;color:#0f172a;\">%s</div>
                                                </div>
                                                <p style=\"margin:0 0 8px;font-size:13px;color:#334155;\">유효시간: 10분</p>
                                                <p style=\"margin:0;font-size:12px;color:#64748b;line-height:1.6;\">본인이 요청하지 않았다면 이 메일을 무시해 주세요.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                """.formatted(purpose, code);
    }
}
