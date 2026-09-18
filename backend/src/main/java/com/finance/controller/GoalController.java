package com.finance.controller;

import com.finance.entity.Goal;
import com.finance.service.GoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;

    @GetMapping
    public ResponseEntity<List<Goal>> listAll() {
        return ResponseEntity.ok(goalService.findAll());
    }

    @PostMapping
    public ResponseEntity<Goal> create(@RequestBody Goal goal) {
        if (goal.getName() == null || goal.getName().isBlank()
                || goal.getTargetAmount() == null || goal.getTargetAmount().compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.badRequest().build();
        }
        goal.setId(null);
        Goal saved = goalService.save(goal);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Goal> update(@PathVariable Long id, @RequestBody Goal goal) {
        if (goal.getName() == null || goal.getName().isBlank()
                || goal.getTargetAmount() == null || goal.getTargetAmount().compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.badRequest().build();
        }
        return goalService.findById(id)
                .map(existing -> {
                    existing.setName(goal.getName());
                    existing.setTargetAmount(goal.getTargetAmount());
                    return ResponseEntity.ok(goalService.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        goalService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
