package com.finance.service;

import com.finance.entity.Goal;
import com.finance.repository.GoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final GoalRepository goalRepository;

    public List<Goal> findAll() {
        return goalRepository.findAll();
    }

    public Optional<Goal> findById(Long id) {
        return goalRepository.findById(id);
    }

    @Transactional
    public Goal save(Goal goal) {
        return goalRepository.save(goal);
    }

    @Transactional
    public void delete(Long id) {
        goalRepository.deleteById(id);
    }
}
