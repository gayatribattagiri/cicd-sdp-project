package com.fooddelivery.klu.controller;

import com.fooddelivery.klu.model.Product;
import com.fooddelivery.klu.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@CrossOrigin
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody Product product) {
        if (product.getName() == null || product.getPrice() == null || product.getQuantity() == null || product.getProductImage() == null || product.getCategory() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "All fields are required"));
        }
        Product saved = productRepository.save(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Product added successfully",
                "productId", saved.getId()
        ));
    }

    @GetMapping
    public List<Product> all(@RequestParam(required = false) String category) {
        if (category != null && !category.trim().isEmpty()) {
            return productRepository.findByCategory(category.trim());
        }
        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable Long id) {
        Optional<Product> opt = productRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Product not found"));
        }
        return ResponseEntity.ok(opt.get());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Product update) {
        Optional<Product> existingOpt = productRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Product not found"));
        }
        Product p = existingOpt.get();
        p.setName(update.getName());
        p.setPrice(update.getPrice());
        p.setQuantity(update.getQuantity());
        p.setProductImage(update.getProductImage());
        p.setCategory(update.getCategory());
        productRepository.save(p);
        return ResponseEntity.ok(Map.of("message", "Product updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Optional<Product> existingOpt = productRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Product not found"));
        }
        productRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Product deleted successfully"));
    }
}


