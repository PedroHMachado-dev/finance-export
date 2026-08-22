package com.finance.parser;

import com.finance.entity.TransactionType;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Component
public class NubankCardCsvParser implements BankCsvParser {

    private static final DateTimeFormatter FORMATTER_YYYY_MM_DD = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter FORMATTER_DD_MM_YYYY = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    @Override
    public boolean canParse(String headerLine) {
        if (headerLine == null) return false;
        String clean = headerLine.toLowerCase().replace("\"", "").trim();
        return clean.contains("date") && clean.contains("title") && clean.contains("amount");
    }

    @Override
    public List<ParsedTransactionRecord> parse(InputStream inputStream) throws Exception {
        List<ParsedTransactionRecord> records = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {
            String headerLine = reader.readLine();
            if (headerLine == null) return records;

            if (headerLine.startsWith("\uFEFF")) {
                headerLine = headerLine.substring(1);
            }

            List<String> headers = NubankCsvParser.parseCsvLine(headerLine);
            int dateIdx = -1;
            int titleIdx = -1;
            int amountIdx = -1;

            for (int i = 0; i < headers.size(); i++) {
                String h = headers.get(i).trim().toLowerCase();
                if (h.contains("date") || h.contains("data")) {
                    dateIdx = i;
                } else if (h.contains("title") || h.contains("desc") || h.contains("título") || h.contains("titulo")) {
                    titleIdx = i;
                } else if (h.contains("amount") || h.contains("valor")) {
                    amountIdx = i;
                }
            }

            if (dateIdx == -1) dateIdx = 0;
            if (titleIdx == -1) titleIdx = 1;
            if (amountIdx == -1) amountIdx = 2;

            String line;
            int lineNum = 0;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty()) continue;
                lineNum++;

                List<String> columns = NubankCsvParser.parseCsvLine(line);
                if (columns.size() <= Math.max(dateIdx, Math.max(titleIdx, amountIdx))) {
                    continue;
                }

                try {
                    String dateStr = columns.get(dateIdx).trim();
                    LocalDate date = parseDate(dateStr);

                    String title = columns.get(titleIdx).trim();
                    String amountStr = columns.get(amountIdx).trim();

                    // Limpa formatação numérica da fatura: "56,50", "- 31,41", "- 743,95"
                    BigDecimal rawAmount = parseCardAmount(amountStr);

                    // Na fatura de cartão:
                    // Valor positivo = Compra no cartão (DESPESA)
                    // Valor negativo = Estorno / Pagamento Recebido (RECEITA / CRÉDITO NA FATURA)
                    TransactionType type;
                    BigDecimal absAmount = rawAmount.abs();

                    if (rawAmount.compareTo(BigDecimal.ZERO) < 0) {
                        type = TransactionType.RECEITA;
                    } else {
                        type = TransactionType.DESPESA;
                    }

                    // Gera identificador determinístico para desduplicação
                    String identifier = String.format("card-%s-%s-%s-%d", dateStr, absAmount.toPlainString(), sanitizeTitle(title), lineNum);

                    String suggestedCategory = suggestCardCategory(title, type);

                    records.add(ParsedTransactionRecord.builder()
                            .date(date)
                            .amount(absAmount)
                            .type(type)
                            .description(title)
                            .rawIdentifier(identifier)
                            .suggestedCategory(suggestedCategory)
                            .source("Cartão de Crédito")
                            .build());

                } catch (Exception e) {
                    System.err.println("Erro ao processar linha da fatura de cartão: " + line + " -> " + e.getMessage());
                }
            }
        }

        return records;
    }

    private LocalDate parseDate(String dateStr) {
        try {
            return LocalDate.parse(dateStr, FORMATTER_YYYY_MM_DD);
        } catch (Exception e) {
            return LocalDate.parse(dateStr, FORMATTER_DD_MM_YYYY);
        }
    }

    private BigDecimal parseCardAmount(String amountStr) {
        String clean = amountStr.replace("\"", "").replace(" ", "").trim();
        boolean isNegative = clean.startsWith("-");
        if (isNegative) {
            clean = clean.substring(1).trim();
        }

        // Trata vírgula e ponto
        if (clean.contains(",") && clean.contains(".")) {
            clean = clean.replace(".", "").replace(",", ".");
        } else if (clean.contains(",")) {
            clean = clean.replace(",", ".");
        }

        BigDecimal val = new BigDecimal(clean);
        return isNegative ? val.negate() : val;
    }

    private String sanitizeTitle(String title) {
        return title.replaceAll("[^a-zA-Z0-9]", "_").toLowerCase();
    }

    private String suggestCardCategory(String title, TransactionType type) {
        if (title == null || title.isEmpty()) {
            return type == TransactionType.RECEITA ? "Outras Receitas" : "Cartão de Crédito";
        }

        String upper = title.toUpperCase();

        if (upper.contains("ESTORNO")) {
            return "Estornos & Reembolsos";
        }
        if (upper.contains("PAGAMENTO RECEBIDO")) {
            return "Pagamento de Fatura";
        }
        if (upper.contains("UBER") || upper.contains("99") || upper.contains("TAXI") || upper.contains("POSTO") || upper.contains("COMBUSTIVEL")) {
            return "Transporte";
        }
        if (upper.contains("APPLE") || upper.contains("GOOGLE") || upper.contains("YOUTUB") || 
            upper.contains("SPOTIFY") || upper.contains("NETFLIX") || upper.contains("PRIME") || 
            upper.contains("AMAZONPRIME")) {
            return "Moradia & Serviços";
        }
        if (upper.contains("PIZZARIA") || upper.contains("BURGER") || upper.contains("PADARIA") || 
            upper.contains("COVABRA") || upper.contains("MERCADAO") || upper.contains("MERCADO") || 
            upper.contains("SUPERMERCADO") || upper.contains("RESTAURANTE") || upper.contains("GRILL") || 
            upper.contains("KOPENHAGEN") || upper.contains("LINDT") || upper.contains("DOCES") || 
            upper.contains("PAMELA DE OLIVEIRA") || upper.contains("LEANDRO VELASCO")) {
            return "Alimentação";
        }
        if (upper.contains("AMAZON") || upper.contains("SHOPEE") || upper.contains("MERCADOLIVRE") || 
            upper.contains("MAGAZINE") || upper.contains("OUTLET") || upper.contains("MODA") || 
            upper.contains("JIM.COM") || upper.contains("PERFUMARIA") || upper.contains("SONEDA")) {
            return "Compras & Lazer";
        }
        if (upper.contains("BARBEARIA") || upper.contains("PANOBIANCO") || upper.contains("ACADEMIA") || upper.contains("FARMACIA") || upper.contains("DROGARIA")) {
            return "Saúde & Cuidados";
        }

        return "Cartão de Crédito";
    }
}
