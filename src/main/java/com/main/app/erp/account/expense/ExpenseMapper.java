package com.main.app.erp.account.expense;

import com.main.app.erp.account.expense.dto.ExpenseDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ExpenseMapper {

    List<ExpenseDto.Expense> selectExpenseList(@Param("keyword") String keyword,
                                                      @Param("offset") int offset,
                                                      @Param("limit") int limit);

    long countExpenseList(@Param("keyword") String keyword);
}
