package com.finance.controller;

import com.finance.entity.Category;
import com.finance.entity.TransactionType;
import com.finance.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<Category>> listAll(@RequestParam(required = false) TransactionType type) {
        if (type != null) {
            return ResponseEntity.ok(categoryService.findByType(type));
        }
        return ResponseEntity.ok(categoryService.findAll());
    }

    @PostMapping
    public ResponseEntity<Category> create(@RequestBody Category category) {
        Category saved = categoryService.save(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> update(@PathVariable Long id, @RequestBody Category category) {
        return categoryService.findById(id)
                .map(existing -> {
                    existing.setName(category.getName());
                    existing.setType(category.getType());
                    existing.setColor(category.getColor());
                    existing.setIcon(category.getIcon());
                    return ResponseEntity.ok(categoryService.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
