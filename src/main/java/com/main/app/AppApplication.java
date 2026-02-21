package com.main.app;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan(basePackages = {
    "com.main.app.official.mapper",
    "com.main.app.community.mapper",
    "com.main.app.auth.mapper",
    "com.main.app.common.mapper"
})
public class AppApplication {

	public static void main(String[] args) {
		SpringApplication.run(AppApplication.class, args);
	}
}