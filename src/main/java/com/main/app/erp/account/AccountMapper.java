package com.main.app.erp.account;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface AccountMapper {

    List<AccountDto.Offering> selectOfferingList(@Param("keyword") String keyword,
                                                  @Param("offset") int offset,
                                                  @Param("limit") int limit);
    long countOfferingList(@Param("keyword") String keyword);

    List<AccountDto.Offering> selectInputList(@Param("keyword") String keyword,
                                               @Param("offset") int offset,
                                               @Param("limit") int limit);
    long countInputList(@Param("keyword") String keyword);

    List<AccountDto.Budget> selectBudgetList(@Param("year") Integer year,
                                              @Param("offset") int offset,
                                              @Param("limit") int limit);
    long countBudgetList(@Param("year") Integer year);

    List<AccountDto.Expense> selectExpenseList(@Param("keyword") String keyword,
                                                @Param("offset") int offset,
                                                @Param("limit") int limit);
    long countExpenseList(@Param("keyword") String keyword);

    AccountDto.Report selectReport(@Param("year") String year, @Param("month") String month);
    List<AccountDto.Offering> selectReportItems(@Param("year") String year, @Param("month") String month);
}
