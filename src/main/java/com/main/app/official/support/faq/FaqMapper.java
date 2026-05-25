package com.main.app.official.support.faq;

import com.main.app.official.support.faq.dto.FaqDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface FaqMapper {

    List<FaqDto> selectFaqItems();
}