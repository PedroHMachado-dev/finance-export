package com.finance.repository;

import com.finance.entity.Transaction;
import com.finance.entity.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    Optional<Transaction> findByRawIdentifier(String rawIdentifier);

    boolean existsByRawIdentifier(String rawIdentifier);

    boolean existsByDateAndAmountAndDescription(LocalDate date, BigDecimal amount, String description);

    @Query("SELECT t FROM Transaction t WHERE " +
           "(:startDate IS NULL OR t.date >= :startDate) AND " +
           "(:endDate IS NULL OR t.date <= :endDate) AND " +
           "(:type IS NULL OR t.type = :type) AND " +
           "(:categoryId IS NULL OR (t.category IS NOT NULL AND t.category.id = :categoryId)) AND " +
           "(:search IS NULL OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(t.notes) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Transaction> findWithFilters(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("type") TransactionType type,
            @Param("categoryId") Long categoryId,
            @Param("search") String search,
            Pageable pageable
    );

    @Query("SELECT t FROM Transaction t WHERE " +
           "(:startDate IS NULL OR t.date >= :startDate) AND " +
           "(:endDate IS NULL OR t.date <= :endDate) " +
           "ORDER BY t.date DESC, t.id DESC")
    List<Transaction> findAllInPeriod(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE " +
           "t.type = :type AND " +
           "(:startDate IS NULL OR t.date >= :startDate) AND " +
           "(:endDate IS NULL OR t.date <= :endDate)")
    BigDecimal sumByTypeAndPeriod(
            @Param("type") TransactionType type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT COUNT(t) FROM Transaction t WHERE " +
           "(:startDate IS NULL OR t.date >= :startDate) AND " +
           "(:endDate IS NULL OR t.date <= :endDate)")
    long countInPeriod(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
