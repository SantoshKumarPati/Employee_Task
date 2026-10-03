package com.example.Task_Management.controller;

import com.example.Task_Management.entity.Employee;
import com.example.Task_Management.service.AuthService;

import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request,
            HttpSession session) {

        try {

            Employee employee =
                    authService.login(
                            request.getUsername(),
                            request.getPassword()
                    );

            session.setAttribute(
                    "employee",
                    employee
            );

            return ResponseEntity.ok(employee);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid username or password");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(
            HttpSession session) {

        session.invalidate();

        return ResponseEntity.ok(
                "Logged out successfully"
        );
    }

    @GetMapping("/me")
    public ResponseEntity<?> currentUser(
            HttpSession session) {

        Employee employee =
                (Employee) session.getAttribute("employee");

        if (employee == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Not logged in");
        }

        return ResponseEntity.ok(employee);
    }

    public static class LoginRequest {

        private String username;

        private String password;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}