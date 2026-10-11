package com.main.app.erp.humen.organization.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

public class OrganizationDto {

    @Data
    public static class Reorg {
        private String reorgKey;
        private String reorgDt;
        private String confYn;
        private String useYn;
        private String reorgTitle;
        private String remark;
        private int departmentCount;
    }

    @Data
    @EqualsAndHashCode(callSuper = true)
    public static class ReorgDetail extends Reorg {
        private java.util.List<Department> departments;
        private java.util.List<DepartmentHistory> histories;
    }

    @Data
    public static class Department {
        private String deptKey;
        private String reorgKey;
        private String deptCd;
        private String deptNm;
        private String engDeptNm;
        private String parentDeptKey;
        private int deptLevel;
        private int sortOrder;
        private String changeTypeCd;
        private String chefEmpNo;
        private String chefName;
        private String deptSysCd;
        private String useYn;
        private int memberCount;
    }

    @Data
    public static class DepartmentHistory {
        private String deptHistKey;
        private String reorgKey;
        private String orgDeptKey;
        private String chgDeptKey;
        private String orgDeptCd;
        private int orgDeptLevel;
        private String chgDeptCd;
        private int chgDeptLevel;
        private String changeTypeCd;
        private String changeNote;
        private String regDtm;
    }
}
