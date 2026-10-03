package com.example.Task_Management;

import com.example.Task_Management.entity.Employee;
import com.example.Task_Management.repository.EmployeeRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initializeEmployees(
            EmployeeRepository employeeRepository) {

        return args -> {

            if (employeeRepository.count() == 0) {

                employeeRepository.save(
                        new Employee(
                                "admin",
                                "admin123",
                                "Admin"
                        )
                );

                employeeRepository.save(
                        new Employee(
                                "john",
                                "john123",
                                "John"
                        )
                );

                employeeRepository.save(
                        new Employee(
                                "sarah",
                                "sarah123",
                                "Sarah"
                        )
                );

                employeeRepository.save(
                        new Employee(
                                "david",
                                "david123",
                                "David"
                        )
                );
            }
        };
    }
}