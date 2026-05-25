package com.main.app.erp.index;

import com.main.app.erp.index.dto.ErpIndexDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ErpIndexMapper {

    long selectTotalMembers();

    long selectSermonPendingCount();

    long selectAccountRecordCount();

    List<ErpIndexDto.TaskItem> selectRecentSermonTasks();
}
