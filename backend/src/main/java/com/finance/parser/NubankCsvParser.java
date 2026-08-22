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
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

@Component
public class NubankCsvParser implements BankCsvParser {

    private static final DateTimeFormatter FORMATTER_DD_MM_YYYY = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter FORMATTER_YYYY_MM_DD = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Override
    public boolean canParse(String headerLine) {
        if (headerLine == null) return false;
        String clean = headerLine.toLowerCase().replace("\"", "").trim();
        return clean.contains("data") && clean.contains("valor") && (clean.contains("descrição") || clean.contains("descricao"));
    }

    @Override
    public List<ParsedTransactionRecord> parse(InputStream inputStream) throws Exception {
        List<ParsedTransactionRecord> records = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {
            String headerLine = reader.readLine();
            if (headerLine == null) {
                return records;
            }

            // Remove BOM se presente
            if (headerLine.startsWith("\uFEFF")) {
                headerLine = headerLine.substring(1);
            }

            List<String> headers = parseCsvLine(headerLine);
            int dateIdx = -1;
            int amountIdx = -1;
            int idIdx = -1;
            int descIdx = -1;

            for (int i = 0; i < headers.size(); i++) {
                String h = headers.get(i).trim().toLowerCase();
                if (h.contains("data")) {
                    dateIdx = i;
                } else if (h.contains("valor")) {
                    amountIdx = i;
                } else if (h.contains("identificador") || h.contains("id")) {
                    idIdx = i;
                } else if (h.contains("descrição") || h.contains("descricao")) {
                    descIdx = i;
                }
            }

            // Fallback para índices posicionais se não encontrado pelo cabeçalho
            if (dateIdx == -1) dateIdx = 0;
            if (amountIdx == -1) amountIdx = 1;
            if (idIdx == -1) idIdx = 2;
            if (descIdx == -1) descIdx = 3;

            String line;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty()) continue;

                List<String> columns = parseCsvLine(line);
                if (columns.size() <= Math.max(dateIdx, amountIdx)) {
                    continue; // Linha inválida ou truncada
                }

                try {
                    String dateStr = columns.get(dateIdx).trim();
                    LocalDate date = parseDate(dateStr);

                    String amountStr = columns.get(amountIdx).trim();
                    BigDecimal rawAmount = parseAmount(amountStr);

                    String identifier = (idIdx >= 0 && idIdx < columns.size()) ? columns.get(idIdx).trim() : null;
                    String description = (descIdx >= 0 && descIdx < columns.size()) ? columns.get(descIdx).trim() : "";

                    TransactionType type = rawAmount.compareTo(BigDecimal.ZERO) >= 0 ? TransactionType.RECEITA : TransactionType.DESPESA;
                    BigDecimal absAmount = rawAmount.abs();

                    String suggestedCategory = suggestCategory(description, type);

                    records.add(ParsedTransactionRecord.builder()
                            .date(date)
                            .amount(absAmount)
                            .type(type)
                            .description(description)
                            .rawIdentifier(identifier)
                            .suggestedCategory(suggestedCategory)
                            .source("Nubank")
                            .build());

                } catch (Exception e) {
                    // Log or skip malformed line
                    System.err.println("Erro ao processar linha do CSV: " + line + " -> " + e.getMessage());
                }
            }
        }

        return records;
    }

    private LocalDate parseDate(String dateStr) {
        try {
            return LocalDate.parse(dateStr, FORMATTER_DD_MM_YYYY);
        } catch (DateTimeParseException e) {
            try {
                return LocalDate.parse(dateStr, FORMATTER_YYYY_MM_DD);
            } catch (DateTimeParseException e2) {
                // Tenta substituir traço por barra se necessário
                return LocalDate.parse(dateStr.replace("-", "/"), FORMATTER_DD_MM_YYYY);
            }
        }
    }

    private BigDecimal parseAmount(String amountStr) {
        String clean = amountStr.replace("R$", "").replace(" ", "").trim();
        // Se usar vírgula como decimal (ex: 1.000,50 ou 100,50)
        if (clean.contains(",") && clean.contains(".")) {
            clean = clean.replace(".", "").replace(",", ".");
        } else if (clean.contains(",")) {
            clean = clean.replace(",", ".");
        }
        return new BigDecimal(clean);
    }

    private String suggestCategory(String description, TransactionType type) {
        if (description == null || description.isEmpty()) {
            return type == TransactionType.RECEITA ? "Outras Receitas" : "Outras Despesas";
        }

        String upper = description.toUpperCase();

        if (type == TransactionType.RECEITA) {
            if (upper.contains("PIX") || upper.contains("TRANSFERÊNCIA RECEBIDA")) {
                return "Transferência Pix";
            }
            if (upper.contains("SALARIO") || upper.contains("SALÁRIO") || upper.contains("PAGAMENTO DE SALARIO")) {
                return "Salário";
            }
            if (upper.contains("RENDIMENTO") || upper.contains("RESGATE") || upper.contains("DIVIDEND")) {
                return "Rendimentos";
            }
            return "Outras Receitas";
        } else {
            // DESPESAS
            if (upper.contains("FATURA") || upper.contains("PAGAMENTO DE FATURA") || upper.contains("CARTAO")) {
                return "Cartão de Crédito";
            }
            if (upper.contains("APLICAÇÃO RDB") || upper.contains("APLICACAO RDB") || upper.contains("INVESTIMENTO") || upper.contains("POUPANCA")) {
                return "Investimentos (RDB)";
            }
            if (upper.contains("MERCADO") || upper.contains("MERCADAO") || upper.contains("SUPERMERCADO") || 
                upper.contains("PADARIA") || upper.contains("RESTAURANTE") || upper.contains("IFOOD") || upper.contains("LANCHONETE")) {
                return "Alimentação";
            }
            if (upper.contains("DESKTOP") || upper.contains("INTERNET") || upper.contains("NET") || 
                upper.contains("CLARO") || upper.contains("VIVO") || upper.contains("TIM") || 
                upper.contains("ENERGIA") || upper.contains("LUZ") || upper.contains("AGUA") || upper.contains("CONDOMINIO")) {
                return "Moradia & Serviços";
            }
            if (upper.contains("PAROQUIA") || upper.contains("PARÓQUIA") || upper.contains("IGREJA") || upper.contains("DOACAO") || upper.contains("DOAÇÃO")) {
                return "Doações & Contribuições";
            }
            if (upper.contains("PICPAY") || upper.contains("MERCADO PAGO") || upper.contains("PAGSEGURO") || upper.contains("PAYPAL")) {
                return "Pagamentos Digitais";
            }
            if (upper.contains("PIX") || upper.contains("TRANSFERÊNCIA ENVIADA")) {
                return "Transferência Pix";
            }
            if (upper.contains("POSTO") || upper.contains("GASOLINA") || upper.contains("UBER") || upper.contains("99APP")) {
                return "Transporte";
            }
            return "Outras Despesas";
        }
    }

    /**
     * Parser manual compatível com RFC 4180 que suporta aspas e vírgulas internas
     */
    public static List<String> parseCsvLine(String line) {
        List<String> values = new ArrayList<>();
        StringBuilder sb = new StringBuilder();
        boolean inQuotes = false;

        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);

            if (c == '\"') {
                if (inQuotes && i + 1 < line.length() && line.charAt(i + 1) == '\"') {
                    sb.append('\"');
                    i++; // skip escaped quote
                } else {
                    inQuotes = !inQuotes;
                }
            } else if ((c == ',' || c == ';') && !inQuotes) {
                values.add(sb.toString());
                sb.setLength(0);
            } else {
                sb.append(c);
            }
        }
        values.add(sb.toString());
        return values;
    }
}
