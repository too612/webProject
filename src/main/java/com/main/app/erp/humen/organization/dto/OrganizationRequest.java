package com.main.app.erp.humen.organization.dto;

import lombok.Data;

public class OrganizationRequest {

    @Data
    public static class ReorgCreate {
        private String reorgDt;
        private String reorgTitle;
        private String remark;
    }

    @Data
    public static class DepartmentCreate {
        private String deptNm;
        private String engDeptNm;
        private String parentDeptKey;
        private String changeTypeCd;
        private String chefEmpNo;
        private String deptSysCd;
        private String remark;
    }

    @Data
    public static class DepartmentUpdate {
        private String deptNm;
        private String engDeptNm;
        private String chefEmpNo;
        private String deptSysCd;
        private String remark;
    }

    @Data
    public static class DepartmentPlacement {
        private String parentDeptKey;
        private Integer targetIndex;
    }
}
