package com.finance.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeeklyDayExpenseDTO {
    private int dayOfWeek;             // 1 = Segunda, 7 = Domingo
    private String dayName;            // "Segunda", "Terça", etc.
    private BigDecimal accountExpense; // Gastos em Conta Corrente / Pix
    private BigDecimal cardExpense;    // Gastos no Cartão de Crédito
    private BigDecimal totalExpense;   // Total geral
}
