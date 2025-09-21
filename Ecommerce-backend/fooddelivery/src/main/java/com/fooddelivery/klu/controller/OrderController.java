package com.fooddelivery.klu.controller;

import com.fooddelivery.klu.model.Order;
import com.fooddelivery.klu.repository.OrderRepository;
import com.fooddelivery.klu.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin("*")
public class OrderController {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public OrderController(OrderRepository orderRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> body) {
        try {
            Number userIdNum = (Number) body.get("user_id");
            String itemsJson = (String) body.get("items_json");
            Number totalAmtNum = (Number) body.get("total_amount");
            String deliveryAddress = (String) body.get("delivery_address");

            if (userIdNum == null || itemsJson == null || totalAmtNum == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Missing required fields"));
            }

            Long userId = userIdNum.longValue();
            if (userRepository.findById(userId).isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid user"));
            }

            Order order = new Order();
            order.setUserId(userId);
            order.setItemsJson(itemsJson);
            order.setTotalAmount(totalAmtNum.doubleValue());
            order.setPaymentStatus("DONE");
            order.setStatus("PLACED");
            order.setDeliveryAddress(deliveryAddress);

            order = orderRepository.save(order);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("order_id", order.getId()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Failed to create order"));
        }
    }

    @GetMapping
    public List<Order> all() {
        return orderRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<Order> byUser(@PathVariable Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @GetMapping("/delivery/{deliveryUserId}")
    public List<Order> byDelivery(@PathVariable Long deliveryUserId) {
        return orderRepository.findByDeliveryUserId(deliveryUserId);
    }

    @PutMapping("/{id}/assign/{deliveryUserId}")
    public ResponseEntity<?> assign(@PathVariable Long id, @PathVariable Long deliveryUserId, @RequestBody(required = false) Map<String, Object> body) {
        Optional<Order> opt = orderRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Order not found"));
        }
        Order order = opt.get();
        order.setDeliveryUserId(deliveryUserId);
        if (body != null) {
            Object addr = body.get("delivery_address");
            if (addr instanceof String) {
                String address = ((String) addr).trim();
                if (!address.isEmpty()) {
                    order.setDeliveryAddress(address);
                }
            }
        }
        orderRepository.save(order);
        return ResponseEntity.ok(Map.of("message", "Assigned"));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<Order> opt = orderRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Order not found"));
        }
        String status = body.get("status");
        if (status == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Status required"));
        }
        Order order = opt.get();
        order.setStatus(status.toUpperCase());
        orderRepository.save(order);
        return ResponseEntity.ok(Map.of("message", "Status updated"));
    }
}


