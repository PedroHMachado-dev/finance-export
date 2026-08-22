package com.finance.service;

import com.finance.dto.ImportSummaryDTO;
import com.finance.dto.TransactionDTO;
import com.finance.entity.Category;
import com.finance.entity.Transaction;
import com.finance.entity.TransactionType;
import com.finance.parser.BankCsvParser;
import com.finance.parser.NubankCardCsvParser;
import com.finance.parser.NubankCsvParser;
import com.finance.parser.ParsedTransactionRecord;
import com.finance.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryService categoryService;
    private final NubankCsvParser nubankCsvParser;
    private final NubankCardCsvParser nubankCardCsvParser;

    @Transactional
    public ImportSummaryDTO importCsv(MultipartFile file) throws Exception {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("O arquivo CSV enviado está vazio.");
        }

        // Auto-detecta o tipo de CSV lendo a primeira linha (cabeçalho)
        String headerLine;
        try (BufferedReader headerReader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            headerLine = headerReader.readLine();
        }

        BankCsvParser parserToUse = nubankCsvParser;
        if (nubankCardCsvParser.canParse(headerLine)) {
            parserToUse = nubankCardCsvParser;
        }

        List<ParsedTransactionRecord> records = parserToUse.parse(file.getInputStream());
        int totalFound = records.size();
        int totalImported = 0;
        int totalSkippedDuplicates = 0;
        List<TransactionDTO> importedList = new ArrayList<>();

        for (ParsedTransactionRecord record : records) {
            boolean isDuplicate = false;

            if (record.getRawIdentifier() != null && !record.getRawIdentifier().trim().isEmpty()) {
                isDuplicate = transactionRepository.existsByRawIdentifier(record.getRawIdentifier());
            } else {
                isDuplicate = transactionRepository.existsByDateAndAmountAndDescription(
                        record.getDate(), record.getAmount(), record.getDescription()
                );
            }

            if (isDuplicate) {
                totalSkippedDuplicates++;
                continue;
            }

            Category category = categoryService.getOrCreateCategory(
                    record.getSuggestedCategory(),
                    record.getType(),
                    null,
                    null
            );

            Transaction tx = Transaction.builder()
                    .date(record.getDate())
                    .amount(record.getAmount())
                    .type(record.getType())
                    .description(record.getDescription())
                    .rawIdentifier(record.getRawIdentifier())
                    .category(category)
                    .source(record.getSource() != null ? record.getSource() : "Nubank")
                    .build();

            Transaction saved = transactionRepository.save(tx);
            importedList.add(TransactionDTO.fromEntity(saved));
            totalImported++;
        }

        String sourceType = (parserToUse instanceof NubankCardCsvParser) ? "Fatura de Cartão" : "Extrato de Conta";
        String message = String.format(
                "%s processada: %d transações importadas com sucesso e %d duplicadas ignoradas.",
                sourceType, totalImported, totalSkippedDuplicates
        );

        return ImportSummaryDTO.builder()
                .totalFound(totalFound)
                .totalImported(totalImported)
                .totalSkippedDuplicates(totalSkippedDuplicates)
                .message(message)
                .importedTransactions(importedList)
                .build();
    }

    public Page<TransactionDTO> findTransactions(
            LocalDate startDate,
            LocalDate endDate,
            TransactionType type,
            Long categoryId,
            String search,
            Pageable pageable
    ) {
        return transactionRepository.findWithFilters(startDate, endDate, type, categoryId, search, pageable)
                .map(TransactionDTO::fromEntity);
    }

    public Optional<TransactionDTO> findById(Long id) {
        return transactionRepository.findById(id).map(TransactionDTO::fromEntity);
    }

    @Transactional
    public TransactionDTO create(TransactionDTO dto) {
        Category category = null;
        if (dto.getCategoryId() != null) {
            category = categoryService.findById(dto.getCategoryId()).orElse(null);
        } else if (dto.getCategoryName() != null && !dto.getCategoryName().trim().isEmpty()) {
            category = categoryService.getOrCreateCategory(dto.getCategoryName(), dto.getType(), dto.getCategoryColor(), null);
        }

        Transaction tx = Transaction.builder()
                .date(dto.getDate() != null ? dto.getDate() : LocalDate.now())
                .amount(dto.getAmount() != null ? dto.getAmount().abs() : BigDecimal.ZERO)
                .type(dto.getType() != null ? dto.getType() : TransactionType.DESPESA)
                .description(dto.getDescription())
                .rawIdentifier(dto.getRawIdentifier())
                .category(category)
                .notes(dto.getNotes())
                .source(dto.getSource() != null ? dto.getSource() : "Manual")
                .build();

        return TransactionDTO.fromEntity(transactionRepository.save(tx));
    }

    @Transactional
    public TransactionDTO update(Long id, TransactionDTO dto) {
        Transaction tx = transactionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Transação não encontrada com ID: " + id));

        if (dto.getDate() != null) tx.setDate(dto.getDate());
        if (dto.getAmount() != null) tx.setAmount(dto.getAmount().abs());
        if (dto.getType() != null) tx.setType(dto.getType());
        if (dto.getDescription() != null) tx.setDescription(dto.getDescription());
        if (dto.getNotes() != null) tx.setNotes(dto.getNotes());
        if (dto.getSource() != null) tx.setSource(dto.getSource());

        if (dto.getCategoryId() != null) {
            Category category = categoryService.findById(dto.getCategoryId()).orElse(null);
            tx.setCategory(category);
        } else if (dto.getCategoryName() != null) {
            Category category = categoryService.getOrCreateCategory(dto.getCategoryName(), tx.getType(), dto.getCategoryColor(), null);
            tx.setCategory(category);
        }

        return TransactionDTO.fromEntity(transactionRepository.save(tx));
    }

    @Transactional
    public void delete(Long id) {
        if (!transactionRepository.existsById(id)) {
            throw new IllegalArgumentException("Transação não encontrada com ID: " + id);
        }
        transactionRepository.deleteById(id);
    }
}
