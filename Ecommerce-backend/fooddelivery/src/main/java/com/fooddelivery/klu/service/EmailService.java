package com.fooddelivery.klu.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final RestTemplate restTemplate;

    @Value("${mailer.url:http://localhost:4001}")
    private String mailerBaseUrl;

    public EmailService(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofSeconds(3))
                .setReadTimeout(Duration.ofSeconds(5))
                .build();
    }

    public void sendWelcomeEmail(String toEmail, String firstName) {
        String url = mailerBaseUrl.replaceAll("/$", "") + "/send-welcome";
        try {
            Map<String, Object> body = new HashMap<>();
            body.put("to", toEmail);
            body.put("firstName", firstName);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> req = new HttpEntity<>(body, headers);
            ResponseEntity<String> resp = restTemplate.postForEntity(url, req, String.class);
            log.info("[EmailService] Welcome email POST -> {} status={} body={}", url, resp.getStatusCode(), resp.getBody());
        } catch (RestClientException ex) {
            log.warn("[EmailService] Failed to call mailer {}: {}", url, ex.getMessage());
        }
    }
}


