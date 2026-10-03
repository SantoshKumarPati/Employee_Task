package com.example.Task_Management.controller;

import com.example.Task_Management.entity.Employee;
import com.example.Task_Management.repository.EmployeeRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeRepository employeeRepository;

    public EmployeeController(
            EmployeeRepository employeeRepository) {

        this.employeeRepository = employeeRepository;
    }

    @GetMapping
    public List<Employee> getEmployees() {

        return employeeRepository.findAll();
    }
}