package com.fooddelivery.klu.controller;

import com.fooddelivery.klu.model.User;
import com.fooddelivery.klu.repository.UserRepository;
import com.fooddelivery.klu.util.JwtUtil;
import com.fooddelivery.klu.service.EmailService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthController(UserRepository userRepository, JwtUtil jwtUtil, EmailService emailService) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> body) {
        try {
            String firstName = ((String) body.get("first_name"));
            String lastName = ((String) body.get("last_name"));
            String email = ((String) body.get("email"));
            String phone = ((String) body.get("phone_number"));
            String password = ((String) body.get("password"));
            String gender = ((String) body.get("gender"));
            Integer age = body.get("age") instanceof Number ? ((Number) body.get("age")).intValue() : null;
            String address = (String) body.getOrDefault("address", null);
            String role = (String) body.getOrDefault("role", "USER");

            // trim and normalize
            firstName = firstName != null ? firstName.trim() : null;
            lastName = lastName != null ? lastName.trim() : null;
            email = email != null ? email.trim() : null;
            phone = phone != null ? phone.trim() : null;
            password = password != null ? password.trim() : null;
            gender = gender != null ? gender.trim() : null;
            address = address != null ? address.trim() : null;
            role = role != null ? role.trim().toUpperCase() : "USER";

            if (firstName == null || lastName == null || email == null || phone == null || password == null || gender == null || age == null || address == null || address.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "All fields are required, including address"));
            }

            User user = new User();
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setEmail(email);
            user.setPhoneNumber(phone);
            user.setPassword(passwordEncoder.encode(password));
            user.setGender(gender);
            user.setAge(age);
            user.setAddress(address);
            user.setRole(role);
            user = userRepository.save(user);

            // Send welcome email via external mailer (best-effort but visible if it fails)
            try {
                emailService.sendWelcomeEmail(user.getEmail(), user.getFirstName());
            } catch (Exception e) {
                System.err.println("[AuthController] Welcome email failed: " + e.getMessage());
            }

            Map<String, Object> resp = new HashMap<>();
            resp.put("message", "User registered successfully");
            resp.put("userId", user.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(resp);
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Email or phone number already exists"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Database error"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, Object> body) {
        String email = (String) body.get("email");
        String password = (String) body.get("password");
        if (email == null || password == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Email and password are required"));
        }
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }
        User user = userOpt.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid password"));
        }
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", user.getId());
        claims.put("email", user.getEmail());
        claims.put("role", user.getRole());
        String token = jwtUtil.generateToken(claims);
        return ResponseEntity.ok(Map.of(
                "jwt_token", token,
                "role", user.getRole(),
                "first_name", user.getFirstName(),
                "user_id", user.getId(),
                "address", user.getAddress()
        ));
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> users() {
        return ResponseEntity.ok(userRepository.findAll());
    }
}


