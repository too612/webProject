package com.main.app.erp.account.budget;

import com.main.app.erp.account.budget.dto.BudgetDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BudgetMapper {

    List<BudgetDto.Budget> selectBudgetList(@Param("year") Integer year,
                                                    @Param("offset") int offset,
                                                    @Param("limit") int limit);

    long countBudgetList(@Param("year") Integer year);
}
