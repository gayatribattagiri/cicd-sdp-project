package com.fooddelivery.klu.controller;

import com.fooddelivery.klu.model.Category;
import com.fooddelivery.klu.model.Product;
import com.fooddelivery.klu.repository.CategoryRepository;
import com.fooddelivery.klu.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin("*")
public class CategoryController {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public CategoryController(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody Category category) {
        if (category.getName() == null || category.getName().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Category name is required"));
        }
        
        if (categoryRepository.existsByName(category.getName().trim())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Category with this name already exists"));
        }
        
        category.setName(category.getName().trim());
        Category saved = categoryRepository.save(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Category added successfully",
                "categoryId", saved.getId()
        ));
    }

    @GetMapping
    public List<Category> all() {
        return categoryRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable Long id) {
        Optional<Category> opt = categoryRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Category not found"));
        }
        return ResponseEntity.ok(opt.get());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Category update) {
        Optional<Category> existingOpt = categoryRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Category not found"));
        }
        
        if (update.getName() == null || update.getName().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Category name is required"));
        }
        
        String newName = update.getName().trim();
        Category existing = existingOpt.get();
        
        // Check if another category with the same name exists (excluding current one)
        if (!existing.getName().equals(newName) && categoryRepository.existsByName(newName)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Category with this name already exists"));
        }
        
        existing.setName(newName);
        existing.setDescription(update.getDescription());
        categoryRepository.save(existing);
        return ResponseEntity.ok(Map.of("message", "Category updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Optional<Category> existingOpt = categoryRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Category not found"));
        }
        
        Category category = existingOpt.get();
        
        // Check if category has products
        List<Product> products = productRepository.findByCategory(category.getName());
        if (!products.isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                    "error", "Cannot delete category. It has " + products.size() + " associated products. Please remove or reassign products first."
            ));
        }
        
        categoryRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Category deleted successfully"));
    }

    @GetMapping("/{id}/products")
    public ResponseEntity<?> getProductsByCategory(@PathVariable Long id) {
        Optional<Category> categoryOpt = categoryRepository.findById(id);
        if (categoryOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Category not found"));
        }
        
        Category category = categoryOpt.get();
        List<Product> products = productRepository.findByCategory(category.getName());
        return ResponseEntity.ok(products);
    }
}
