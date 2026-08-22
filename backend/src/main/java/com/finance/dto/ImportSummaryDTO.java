package com.finance.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImportSummaryDTO {

    private int totalFound;
    private int totalImported;
    private int totalSkippedDuplicates;
    private String message;
    private List<TransactionDTO> importedTransactions;
}
