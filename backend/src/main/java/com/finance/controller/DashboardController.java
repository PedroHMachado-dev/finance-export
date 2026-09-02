package com.finance.controller;

import com.finance.dto.*;
import com.finance.entity.TransactionType;
import com.finance.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDTO> getSummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Long categoryId
    ) {
        return ResponseEntity.ok(dashboardService.getSummary(startDate, endDate, categoryId));
    }

    @GetMapping("/by-category")
    public ResponseEntity<List<CategorySummaryDTO>> getByCategory(
            @RequestParam(defaultValue = "DESPESA") TransactionType type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return ResponseEntity.ok(dashboardService.getByCategory(type, startDate, endDate));
    }

    @GetMapping("/monthly-trend")
    public ResponseEntity<List<MonthlyTrendDTO>> getMonthlyTrend(
            @RequestParam(defaultValue = "2026") int year
    ) {
        return ResponseEntity.ok(dashboardService.getMonthlyTrend(year));
    }

    /**
     * Gráfico 1: Controle Mensal (Gastos Diários)
     */
    @GetMapping("/daily-expenses")
    public ResponseEntity<List<DailyExpenseDTO>> getDailyExpenses(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Long categoryId
    ) {
        return ResponseEntity.ok(dashboardService.getDailyExpenses(startDate, endDate, categoryId));
    }

    /**
     * Gráfico 2: Controle Semanal (Por Dia da Semana)
     */
    @GetMapping("/weekly-expenses")
    public ResponseEntity<List<WeeklyDayExpenseDTO>> getWeeklyExpenses(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return ResponseEntity.ok(dashboardService.getWeeklyExpenses(startDate, endDate));
    }

    /**
     * Gráfico 3: Comparativo Dinheiro Guardado (Caixinhas)
     */
    @GetMapping("/savings-trend")
    public ResponseEntity<List<SavingsTrendDTO>> getSavingsTrend(
            @RequestParam(defaultValue = "2026") int year
    ) {
        return ResponseEntity.ok(dashboardService.getSavingsTrend(year));
    }
}
