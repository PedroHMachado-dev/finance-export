package com.finance.config;

import com.finance.entity.Category;
import com.finance.entity.TransactionType;
import com.finance.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) {
        if (categoryRepository.count() == 0) {
            List<Category> defaultCategories = List.of(
                    // Receitas
                    Category.builder().name("Salário").type(TransactionType.RECEITA).color("#10B981").icon("briefcase").build(),
                    Category.builder().name("Transferência Pix").type(TransactionType.RECEITA).color("#06B6D4").icon("arrow-down-left").build(),
                    Category.builder().name("Rendimentos").type(TransactionType.RECEITA).color("#8B5CF6").icon("trending-up").build(),
                    Category.builder().name("Outras Receitas").type(TransactionType.RECEITA).color("#3B82F6").icon("plus-circle").build(),

                    // Despesas
                    Category.builder().name("Alimentação").type(TransactionType.DESPESA).color("#F59E0B").icon("shopping-cart").build(),
                    Category.builder().name("Cartão de Crédito").type(TransactionType.DESPESA).color("#EF4444").icon("credit-card").build(),
                    Category.builder().name("Investimentos (RDB)").type(TransactionType.DESPESA).color("#6366F1").icon("piggy-bank").build(),
                    Category.builder().name("Moradia & Serviços").type(TransactionType.DESPESA).color("#EC4899").icon("home").build(),
                    Category.builder().name("Transporte").type(TransactionType.DESPESA).color("#F97316").icon("car").build(),
                    Category.builder().name("Doações & Contribuições").type(TransactionType.DESPESA).color("#14B8A6").icon("heart").build(),
                    Category.builder().name("Pagamentos Digitais").type(TransactionType.DESPESA).color("#A855F7").icon("smartphone").build(),
                    Category.builder().name("Outras Despesas").type(TransactionType.DESPESA).color("#6B7280").icon("minus-circle").build()
            );

            categoryRepository.saveAll(defaultCategories);
            System.out.println("Categorias padrão inicializadas com sucesso!");
        }
    }
}
