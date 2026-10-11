package com.main.app.erp.humen.personnelmove;

import com.main.app.erp.humen.personnelmove.dto.PersonnelMoveDto.*;
import java.time.LocalDate;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface PersonnelMoveMapper {
    List<Assignment> selectPersonnelMoveList(ListQuery query);
    long countPersonnelMoveList(ListQuery query);
    Assignment selectAssignment(@Param("key") String key, @Param("today") LocalDate today);
    Person lockPerson(String personKey);
    Person lockConcurrent(@Param("personKey") String personKey, @Param("concurrentKey") String concurrentKey);
    List<Assignment> selectTargetAssignments(@Param("personKey") String personKey, @Param("concurrentKey") String concurrentKey);
    int insertAssignment(@Param("row") Assignment row, @Param("audit") Audit audit);
    int updateAssignment(@Param("row") Assignment row, @Param("audit") Audit audit);
    int deleteAssignment(@Param("key") String key, @Param("version") long version,
            @Param("reason") String reason, @Param("audit") Audit audit);
    boolean departmentExists(String deptCd);
    boolean codeExists(@Param("code") String code, @Param("category") String category);
    boolean countryExists(String countryCode);
    List<CodeOption> selectCodeOptions(String category);
    List<Person> selectEmployees(@Param("keyword") String keyword, @Param("offset") long offset, @Param("limit") int limit);
    long countEmployees(String keyword);
    List<Person> selectConcurrent(String personKey);
    int advanceConcurrentNumber(String personKey);
    int insertConcurrent(@Param("row") Person row, @Param("audit") Audit audit);
    int applyMain(@Param("row") Assignment row, @Param("audit") Audit audit);
    int applyConcurrent(@Param("row") Assignment row, @Param("audit") Audit audit);
    List<String> selectSyncPersonKeys();
}
