package com.finance.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavingsTrendDTO {
    private int month;
    private int year;
    private String monthLabel;          // ex: "Julho/2026"
    private BigDecimal savedThisMonth;  // Valor guardado no mês atual
    private BigDecimal savedPreviousMonth; // Valor guardado no mês anterior
    private double growthPercentage;    // Variação percentual (+/- X%)
    private BigDecimal cumulativeTotal; // Total acumulado guardado até este mês
}
