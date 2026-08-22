package com.finance.parser;

import com.finance.entity.TransactionType;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class NubankCsvParserTest {

    private final NubankCsvParser parser = new NubankCsvParser();

    @Test
    void shouldParseNubankCsvCorrectly() throws Exception {
        String csvContent = "Data,Valor,Identificador,Descrição\n" +
                "01/07/2026,1000.00,6a44e995-9de6-46bf-8434-8a1510f91ad8,Transferência recebida pelo Pix - VALDIRENE\n" +
                "03/07/2026,-1874.22,6a4766d3-dbbf-4c77-a60e-374b451b26aa,Pagamento de fatura\n" +
                "03/07/2026,-1117.61,6a476799-479f-4c4e-a7c0-a37a85166072,Aplicação RDB\n";

        ByteArrayInputStream inputStream = new ByteArrayInputStream(csvContent.getBytes(StandardCharsets.UTF_8));
        List<ParsedTransactionRecord> records = parser.parse(inputStream);

        assertEquals(3, records.size());

        // Item 1: Receita
        ParsedTransactionRecord item1 = records.get(0);
        assertEquals(LocalDate.of(2026, 7, 1), item1.getDate());
        assertEquals(new BigDecimal("1000.00"), item1.getAmount());
        assertEquals(TransactionType.RECEITA, item1.getType());
        assertEquals("Transferência Pix", item1.getSuggestedCategory());
        assertEquals("6a44e995-9de6-46bf-8434-8a1510f91ad8", item1.getRawIdentifier());

        // Item 2: Despesa Fatura
        ParsedTransactionRecord item2 = records.get(1);
        assertEquals(LocalDate.of(2026, 7, 3), item2.getDate());
        assertEquals(new BigDecimal("1874.22"), item2.getAmount());
        assertEquals(TransactionType.DESPESA, item2.getType());
        assertEquals("Cartão de Crédito", item2.getSuggestedCategory());

        // Item 3: Despesa RDB
        ParsedTransactionRecord item3 = records.get(2);
        assertEquals(LocalDate.of(2026, 7, 3), item3.getDate());
        assertEquals(new BigDecimal("1117.61"), item3.getAmount());
        assertEquals(TransactionType.DESPESA, item3.getType());
        assertEquals("Investimentos (RDB)", item3.getSuggestedCategory());
    }
}
