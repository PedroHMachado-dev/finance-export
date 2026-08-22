package com.finance.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyExpenseDTO {
    private LocalDate date;
    private String dayLabel;        // ex: "2026-07-01"
    private BigDecimal accountExpense; // Gastos em Conta Corrente / Pix
    private BigDecimal cardExpense;    // Gastos no Cartão de Crédito
    private BigDecimal totalExpense;   // Total de despesas no dia
    private BigDecimal income;         // Receitas no dia
}
