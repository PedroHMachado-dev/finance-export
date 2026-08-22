package com.finance.service;

import com.finance.dto.*;
import com.finance.entity.Transaction;
import com.finance.entity.TransactionType;
import com.finance.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TransactionRepository transactionRepository;

    public DashboardSummaryDTO getSummary(LocalDate startDate, LocalDate endDate) {
        BigDecimal income = transactionRepository.sumByTypeAndPeriod(TransactionType.RECEITA, startDate, endDate);
        BigDecimal expense = transactionRepository.sumByTypeAndPeriod(TransactionType.DESPESA, startDate, endDate);
        long count = transactionRepository.countInPeriod(startDate, endDate);

        if (income == null) income = BigDecimal.ZERO;
        if (expense == null) expense = BigDecimal.ZERO;

        BigDecimal balance = income.subtract(expense);

        return DashboardSummaryDTO.builder()
                .totalIncome(income)
                .totalExpense(expense)
                .currentBalance(balance)
                .transactionCount(count)
                .build();
    }

    public List<CategorySummaryDTO> getByCategory(TransactionType type, LocalDate startDate, LocalDate endDate) {
        List<Transaction> transactions = transactionRepository.findAllInPeriod(startDate, endDate);

        List<Transaction> filtered = transactions.stream()
                .filter(t -> t.getType() == type)
                .toList();

        BigDecimal total = filtered.stream()
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, List<Transaction>> grouped = filtered.stream()
                .collect(Collectors.groupingBy(t -> t.getCategory() != null ? t.getCategory().getName() : "Sem Categoria"));

        List<CategorySummaryDTO> result = new ArrayList<>();

        for (Map.Entry<String, List<Transaction>> entry : grouped.entrySet()) {
            String categoryName = entry.getKey();
            List<Transaction> txList = entry.getValue();

            BigDecimal categoryTotal = txList.stream()
                    .map(Transaction::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            double percentage = 0.0;
            if (total.compareTo(BigDecimal.ZERO) > 0) {
                percentage = categoryTotal.divide(total, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                        .doubleValue();
            }

            Long catId = null;
            String catColor = "#9CA3AF";
            if (!txList.isEmpty() && txList.get(0).getCategory() != null) {
                catId = txList.get(0).getCategory().getId();
                catColor = txList.get(0).getCategory().getColor();
            }

            result.add(CategorySummaryDTO.builder()
                    .categoryId(catId)
                    .categoryName(categoryName)
                    .categoryColor(catColor)
                    .type(type)
                    .totalAmount(categoryTotal)
                    .percentage(percentage)
                    .count(txList.size())
                    .build());
        }

        result.sort((a, b) -> b.getTotalAmount().compareTo(a.getTotalAmount()));
        return result;
    }

    public List<MonthlyTrendDTO> getMonthlyTrend(int year) {
        LocalDate startOfYear = LocalDate.of(year, 1, 1);
        LocalDate endOfYear = LocalDate.of(year, 12, 31);

        List<Transaction> transactions = transactionRepository.findAllInPeriod(startOfYear, endOfYear);

        List<MonthlyTrendDTO> list = new ArrayList<>();
        Locale ptBr = new Locale("pt", "BR");

        for (int m = 1; m <= 12; m++) {
            final int monthVal = m;
            List<Transaction> monthTxs = transactions.stream()
                    .filter(t -> t.getDate().getMonthValue() == monthVal)
                    .toList();

            BigDecimal monthIncome = monthTxs.stream()
                    .filter(t -> t.getType() == TransactionType.RECEITA)
                    .map(Transaction::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal monthExpense = monthTxs.stream()
                    .filter(t -> t.getType() == TransactionType.DESPESA)
                    .map(Transaction::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal balance = monthIncome.subtract(monthExpense);

            String monthName = Month.of(m).getDisplayName(TextStyle.SHORT, ptBr);
            monthName = monthName.substring(0, 1).toUpperCase() + monthName.substring(1);

            list.add(MonthlyTrendDTO.builder()
                    .month(m)
                    .year(year)
                    .monthLabel(monthName + "/" + year)
                    .income(monthIncome)
                    .expense(monthExpense)
                    .balance(balance)
                    .build());
        }

        return list;
    }

    /**
     * Gráfico 1: Controle Mensal (Gastos Diários)
     * Separa com precisão Cartão de Crédito (compras e fatura) de Conta Corrente / Pix
     */
    public List<DailyExpenseDTO> getDailyExpenses(LocalDate startDate, LocalDate endDate) {
        if (startDate == null) startDate = LocalDate.of(2026, 7, 1);
        if (endDate == null) endDate = LocalDate.of(2026, 7, 31);

        List<Transaction> transactions = transactionRepository.findAllInPeriod(startDate, endDate);

        List<DailyExpenseDTO> dailyList = new ArrayList<>();
        LocalDate curr = startDate;

        while (!curr.isAfter(endDate)) {
            final LocalDate day = curr;
            List<Transaction> dayTxs = transactions.stream()
                    .filter(t -> t.getDate().isEqual(day))
                    .toList();

            // Gastos em Conta / Pix (excluindo os pagamentos de fatura e compras de cartão)
            BigDecimal accountExp = dayTxs.stream()
                    .filter(t -> t.getType() == TransactionType.DESPESA && !isCardRelatedTransaction(t))
                    .map(Transaction::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            // Gastos no Cartão (inclui compras de cartão e pagamentos de fatura)
            BigDecimal cardExp = dayTxs.stream()
                    .filter(t -> t.getType() == TransactionType.DESPESA && isCardRelatedTransaction(t))
                    .map(Transaction::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal inc = dayTxs.stream()
                    .filter(t -> t.getType() == TransactionType.RECEITA)
                    .map(Transaction::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            dailyList.add(DailyExpenseDTO.builder()
                    .date(day)
                    .dayLabel(day.toString())
                    .accountExpense(accountExp)
                    .cardExpense(cardExp)
                    .totalExpense(accountExp.add(cardExp))
                    .income(inc)
                    .build());

            curr = curr.plusDays(1);
        }

        return dailyList;
    }

    /**
     * Gráfico 2: Controle Semanal (Distribuição por Dias da Semana)
     */
    public List<WeeklyDayExpenseDTO> getWeeklyExpenses(LocalDate startDate, LocalDate endDate) {
        List<Transaction> transactions = transactionRepository.findAllInPeriod(startDate, endDate);

        String[] dayNames = {"Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"};
        List<WeeklyDayExpenseDTO> result = new ArrayList<>();

        for (int i = 1; i <= 7; i++) {
            final int dayOfWeekVal = i;
            List<Transaction> dayOfWeekTxs = transactions.stream()
                    .filter(t -> t.getDate().getDayOfWeek().getValue() == dayOfWeekVal)
                    .toList();

            BigDecimal accountExp = dayOfWeekTxs.stream()
                    .filter(t -> t.getType() == TransactionType.DESPESA && !isCardRelatedTransaction(t))
                    .map(Transaction::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal cardExp = dayOfWeekTxs.stream()
                    .filter(t -> t.getType() == TransactionType.DESPESA && isCardRelatedTransaction(t))
                    .map(Transaction::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            result.add(WeeklyDayExpenseDTO.builder()
                    .dayOfWeek(i)
                    .dayName(dayNames[i - 1])
                    .accountExpense(accountExp)
                    .cardExpense(cardExp)
                    .totalExpense(accountExp.add(cardExp))
                    .build());
        }

        return result;
    }

    /**
     * Gráfico 3: Comparativo Dinheiro Guardado (Caixinhas / RDB)
     */
    public List<SavingsTrendDTO> getSavingsTrend(int year) {
        LocalDate startOfYear = LocalDate.of(year, 1, 1);
        LocalDate endOfYear = LocalDate.of(year, 12, 31);

        List<Transaction> transactions = transactionRepository.findAllInPeriod(startOfYear, endOfYear);

        // Filtra transações que representam dinheiro guardado / aplicado
        List<Transaction> savingsTxs = transactions.stream()
                .filter(this::isSavingsTransaction)
                .toList();

        List<SavingsTrendDTO> trend = new ArrayList<>();
        Locale ptBr = new Locale("pt", "BR");
        BigDecimal cumulative = BigDecimal.ZERO;
        BigDecimal previousMonthSaved = BigDecimal.ZERO;

        for (int m = 1; m <= 12; m++) {
            final int monthVal = m;
            BigDecimal savedThisMonth = savingsTxs.stream()
                    .filter(t -> t.getDate().getMonthValue() == monthVal)
                    .map(Transaction::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            cumulative = cumulative.add(savedThisMonth);

            double growth = 0.0;
            if (previousMonthSaved.compareTo(BigDecimal.ZERO) > 0) {
                growth = savedThisMonth.subtract(previousMonthSaved)
                        .divide(previousMonthSaved, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                        .doubleValue();
            } else if (savedThisMonth.compareTo(BigDecimal.ZERO) > 0) {
                growth = 100.0;
            }

            String monthName = Month.of(m).getDisplayName(TextStyle.FULL, ptBr);
            monthName = monthName.substring(0, 1).toUpperCase() + monthName.substring(1);

            trend.add(SavingsTrendDTO.builder()
                    .month(m)
                    .year(year)
                    .monthLabel(monthName + "/" + year)
                    .savedThisMonth(savedThisMonth)
                    .savedPreviousMonth(previousMonthSaved)
                    .growthPercentage(growth)
                    .cumulativeTotal(cumulative)
                    .build());

            previousMonthSaved = savedThisMonth;
        }

        return trend;
    }

    /**
     * Identifica transações relacionadas ao Cartão de Crédito
     * (tanto itens da fatura quanto pagamentos de fatura feitos na conta)
     */
    private boolean isCardRelatedTransaction(Transaction t) {
        if ("Cartão de Crédito".equalsIgnoreCase(t.getSource())) {
            return true;
        }
        if (t.getCategory() != null && "Cartão de Crédito".equalsIgnoreCase(t.getCategory().getName())) {
            return true;
        }
        if (t.getDescription() != null) {
            String desc = t.getDescription().toUpperCase();
            return desc.contains("PAGAMENTO DE FATURA") || desc.contains("FATURA DO CARTÃO") || desc.contains("PAGAMENTO FATURA");
        }
        return false;
    }

    /**
     * Identifica dinheiro guardado / caixinhas / RDB
     */
    private boolean isSavingsTransaction(Transaction t) {
        if (t.getCategory() != null) {
            String cat = t.getCategory().getName().toUpperCase();
            if (cat.contains("INVESTIMENTO") || cat.contains("RDB") || cat.contains("CAIXINHA") || cat.contains("POUPANCA") || cat.contains("POUPANÇA")) {
                return true;
            }
        }
        if (t.getDescription() != null) {
            String desc = t.getDescription().toUpperCase();
            return desc.contains("APLICAÇÃO RDB") || desc.contains("APLICACAO RDB") || desc.contains("GUARDADO") || desc.contains("CAIXINHA");
        }
        return false;
    }
}
