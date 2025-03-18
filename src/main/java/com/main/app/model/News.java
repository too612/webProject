package com.main.app.model;

public class News {
    private String title;
    private String date;

    // Constructors
    public News(String title, String date) {
        this.title = title;
        this.date = date;
    }

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}
