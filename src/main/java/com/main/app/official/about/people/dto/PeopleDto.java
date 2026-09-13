package com.main.app.official.about.people.dto;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class PeopleDto {
    private String headline;
    private String summary;
    private PastorProfile pastor;
    private List<LeaderCard> leaders = new ArrayList<>();

    @Data
    public static class PastorProfile {
        private String name;
        private String title;
        private String greeting;
        private String imageUrl;
        private List<Education> educations = new ArrayList<>();
        private List<Career> careers = new ArrayList<>();
    }

    @Data
    public static class LeaderCard {
        private String name;
        private String role;
        private String ministry;
        private String intro;
        private String imageUrl;
        private List<Education> educations = new ArrayList<>();
        private List<Career> careers = new ArrayList<>();
    }

    @Data
    public static class Education {
        private String schoolTypeName;
        private String schoolName;
        private String degreeName;
        private String major;
        private String graduationStatusName;
        private String admissionDate;
        private String graduationDate;
        private boolean finalEducation;
    }

    @Data
    public static class Career {
        private String companyName;
        private String hireDate;
        private String retireDate;
        private String employmentTypeName;
        private String jobTitle;
        private String jobResponsibility;
    }
}