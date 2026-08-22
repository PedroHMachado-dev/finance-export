package com.finance.parser;

import com.finance.entity.TransactionType;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class NubankCardCsvParserTest {

    private final NubankCardCsvParser parser = new NubankCardCsvParser();

    @Test
    void shouldParseNubankCreditCardCsv() throws Exception {
        String csvContent = "date,title,amount\n" +
                "2026-06-27,Leandro Velasco,\"56,50\"\n" +
                "2026-06-27,Uber - NuPay,\"32,94\"\n" +
                "2026-06-24,\"Estorno de \"\"Apple.Com/Bill\"\" (Apple)\",\"- 31,41\"\n" +
                "2026-05-29,Pagamento recebido,\"- 743,95\"\n";

        ByteArrayInputStream inputStream = new ByteArrayInputStream(csvContent.getBytes(StandardCharsets.UTF_8));
        List<ParsedTransactionRecord> records = parser.parse(inputStream);

        assertEquals(4, records.size());

        // Compra 1
        ParsedTransactionRecord item1 = records.get(0);
        assertEquals(LocalDate.of(2026, 6, 27), item1.getDate());
        assertEquals(new BigDecimal("56.50"), item1.getAmount());
        assertEquals(TransactionType.DESPESA, item1.getType());
        assertEquals("Alimentação", item1.getSuggestedCategory());
        assertEquals("Cartão de Crédito", item1.getSource());

        // Compra 2 (Uber)
        ParsedTransactionRecord item2 = records.get(1);
        assertEquals(LocalDate.of(2026, 6, 27), item2.getDate());
        assertEquals(new BigDecimal("32.94"), item2.getAmount());
        assertEquals(TransactionType.DESPESA, item2.getType());
        assertEquals("Transporte", item2.getSuggestedCategory());

        // Estorno (Crédito)
        ParsedTransactionRecord item3 = records.get(2);
        assertEquals(LocalDate.of(2026, 6, 24), item3.getDate());
        assertEquals(new BigDecimal("31.41"), item3.getAmount());
        assertEquals(TransactionType.RECEITA, item3.getType());
        assertEquals("Estornos & Reembolsos", item3.getSuggestedCategory());

        // Pagamento Recebido
        ParsedTransactionRecord item4 = records.get(3);
        assertEquals(LocalDate.of(2026, 5, 29), item4.getDate());
        assertEquals(new BigDecimal("743.95"), item4.getAmount());
        assertEquals(TransactionType.RECEITA, item4.getType());
        assertEquals("Pagamento de Fatura", item4.getSuggestedCategory());
    }
}
