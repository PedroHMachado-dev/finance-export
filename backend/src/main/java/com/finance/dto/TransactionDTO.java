package com.finance.dto;

import com.finance.entity.Transaction;
import com.finance.entity.TransactionType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionDTO {

    private Long id;
    private LocalDate date;
    private BigDecimal amount;
    private TransactionType type;
    private String description;
    private String rawIdentifier;
    private Long categoryId;
    private String categoryName;
    private String categoryColor;
    private String notes;
    private String source;
    private LocalDateTime createdAt;

    public static TransactionDTO fromEntity(Transaction t) {
        if (t == null) return null;
        return TransactionDTO.builder()
                .id(t.getId())
                .date(t.getDate())
                .amount(t.getAmount())
                .type(t.getType())
                .description(t.getDescription())
                .rawIdentifier(t.getRawIdentifier())
                .categoryId(t.getCategory() != null ? t.getCategory().getId() : null)
                .categoryName(t.getCategory() != null ? t.getCategory().getName() : "Sem Categoria")
                .categoryColor(t.getCategory() != null ? t.getCategory().getColor() : "#9CA3AF")
                .notes(t.getNotes())
                .source(t.getSource())
                .createdAt(t.getCreatedAt())
                .build();
    }
}
