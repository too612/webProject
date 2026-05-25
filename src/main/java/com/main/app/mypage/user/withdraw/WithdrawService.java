package com.main.app.mypage.user.withdraw;

import com.main.app.mypage.user.withdraw.dto.WithdrawPolicyDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class WithdrawService {

    private final WithdrawMapper withdrawMapper;

    @Transactional(readOnly = true)
    public WithdrawPolicyDto getWithdrawPolicy(String userId) {
        long activityCount = withdrawMapper.countActivityList(userId);

        WithdrawPolicyDto policy = new WithdrawPolicyDto();
        policy.setAllowed(true);
        policy.setMessage("회원 탈퇴 후 복구가 불가능합니다.");
        policy.setActivityCount(activityCount);
        return policy;
    }
}
