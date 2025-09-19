package com.fooddelivery.klu.repository;

import com.fooddelivery.klu.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
    List<Order> findByDeliveryUserId(Long deliveryUserId);
}


