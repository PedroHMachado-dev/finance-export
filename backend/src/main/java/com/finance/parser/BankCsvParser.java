package com.finance.parser;

import java.io.InputStream;
import java.util.List;

public interface BankCsvParser {
    boolean canParse(String headerLine);
    List<ParsedTransactionRecord> parse(InputStream inputStream) throws Exception;
}
