package com.finance.dto;

import com.finance.entity.TransactionType;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategorySummaryDTO {

    private Long categoryId;
    private String categoryName;
    private String categoryColor;
    private TransactionType type;
    private BigDecimal totalAmount;
    private double percentage;
    private long count;
}
