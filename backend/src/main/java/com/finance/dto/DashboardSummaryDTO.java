package com.finance.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardSummaryDTO {

    private BigDecimal totalIncome;    // Total de receitas
    private BigDecimal totalExpense;   // Total de despesas
    private BigDecimal currentBalance; // Saldo (Receitas - Despesas)
    private long transactionCount;     // Quantidade de transações
}
