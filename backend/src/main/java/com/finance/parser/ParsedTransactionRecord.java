package com.finance.parser;

import com.finance.entity.TransactionType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParsedTransactionRecord {
    private LocalDate date;
    private BigDecimal amount;
    private TransactionType type;
    private String description;
    private String rawIdentifier;
    private String suggestedCategory;
    private String source;
}
