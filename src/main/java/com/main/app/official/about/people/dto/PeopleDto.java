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
        private String biography;
        private String imageUrl;
    }

    @Data
    public static class LeaderCard {
        private String name;
        private String role;
        private String ministry;
        private String intro;
        private String biography;
        private String imageUrl;
    }
}