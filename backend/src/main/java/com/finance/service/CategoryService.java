package com.finance.service;

import com.finance.entity.Category;
import com.finance.entity.TransactionType;
import com.finance.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    public List<Category> findByType(TransactionType type) {
        return categoryRepository.findByType(type);
    }

    public Optional<Category> findById(Long id) {
        return categoryRepository.findById(id);
    }

    public Optional<Category> findByName(String name) {
        return categoryRepository.findByNameIgnoreCase(name);
    }

    @Transactional
    public Category getOrCreateCategory(String name, TransactionType type, String color, String icon) {
        return categoryRepository.findByNameIgnoreCase(name)
                .orElseGet(() -> categoryRepository.save(Category.builder()
                        .name(name)
                        .type(type)
                        .color(color != null ? color : (type == TransactionType.RECEITA ? "#10B981" : "#EF4444"))
                        .icon(icon != null ? icon : "tag")
                        .build()));
    }

    @Transactional
    public Category save(Category category) {
        return categoryRepository.save(category);
    }

    @Transactional
    public void delete(Long id) {
        categoryRepository.deleteById(id);
    }
}
