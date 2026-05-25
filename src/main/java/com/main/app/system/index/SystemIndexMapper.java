package com.main.app.system.index;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SystemIndexMapper {

    long selectActiveAccounts();

    long selectTodayWarnings();

    long selectPendingRoleRequests();

    long selectBackupHistoryCount();

    long selectBackupSuccessCount();
}
