package com.example.Task_Management.service;

import com.example.Task_Management.entity.Employee;
import com.example.Task_Management.repository.EmployeeRepository;

import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final EmployeeRepository employeeRepository;

    public AuthService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public Employee login(String username, String password) {

        Employee employee = employeeRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid username or password"
                        ));

        if (!employee.getPassword().equals(password)) {

            throw new RuntimeException(
                    "Invalid username or password"
            );
        }

        return employee;
    }
}