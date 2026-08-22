package com.finance.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlyTrendDTO {

    private String monthLabel; // ex: "07/2026" ou "Jul 2026"
    private int year;
    private int month;
    private BigDecimal income;
    private BigDecimal expense;
    private BigDecimal balance;
}
