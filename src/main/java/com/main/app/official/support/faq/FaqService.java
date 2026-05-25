package com.main.app.official.support.faq;

import com.main.app.official.support.faq.dto.FaqDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service("officialSupportFaqService")
@RequiredArgsConstructor
public class FaqService {

    private final FaqMapper faqMapper;

    @Transactional(readOnly = true)
    public List<FaqDto> getFaqItems() {
        return faqMapper.selectFaqItems();
    }
}