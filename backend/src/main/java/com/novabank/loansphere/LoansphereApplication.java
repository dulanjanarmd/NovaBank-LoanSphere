package com.novabank.loansphere;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LoansphereApplication {
    public static void main(String[] args) {
        SpringApplication.run(LoansphereApplication.class, args);
    }
}
