package com.fooddelivery.klu.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "items_json", columnDefinition = "TEXT", nullable = false)
    private String itemsJson; // JSON string of cart items

    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;

    @Column(name = "status", nullable = false, length = 20)
    private String status = "PLACED"; // PLACED, DELIVERED

    @Column(name = "payment_status", nullable = false, length = 20)
    private String paymentStatus = "DONE"; // DONE for now

    @Column(name = "delivery_address", length = 500)
    private String deliveryAddress;

    @Column(name = "delivery_user_id")
    private Long deliveryUserId; // delivery boy user id (optional)

    @Column(name = "delivery_user_address", length = 500)
    private String deliveryUserAddress; // address of the delivery person (optional)

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getItemsJson() { return itemsJson; }
    public void setItemsJson(String itemsJson) { this.itemsJson = itemsJson; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public Long getDeliveryUserId() { return deliveryUserId; }
    public void setDeliveryUserId(Long deliveryUserId) { this.deliveryUserId = deliveryUserId; }

    public String getDeliveryUserAddress() { return deliveryUserAddress; }
    public void setDeliveryUserAddress(String deliveryUserAddress) { this.deliveryUserAddress = deliveryUserAddress; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}


