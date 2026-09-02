# 💳 FinanceExport — Personal Finance & Statement Management System

[![Java 17](https://img.shields.io/badge/Java-17-orange.svg)](https://adoptium.net/)
[![Spring Boot 3](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![MySQL 8.0](https://img.shields.io/badge/MySQL-8.0-4479A1.svg)](https://www.mysql.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern, full-stack personal finance application built to import, parse, intelligently categorize, and visualize banking transactions from **bank statements** and **credit card invoices (CSV format)**.

Designed with a clean, minimalist user interface featuring an interactive **React Bits Dock**, rich **Recharts** data visualizations, dark mode support, and an enterprise-grade **Java Spring Boot 3 + MySQL** backend.

---

## ✨ Features

- 📥 **Multi-format CSV Importer**:
  - Automatically identifies and parses **Bank Account Statements** (`Data,Valor,Identificador,Descrição`) and **Credit Card Invoices** (`date,title,amount`).
  - Supports Brazilian currency formatting (`R$ 1.234,56`), multiple date patterns (`dd/MM/yyyy`, `yyyy-MM-dd`), refunds (negative values), and installments.
- 🛡️ **Deduplication Engine**:
  - Prevents duplicate entries when importing overlapping statement periods via deterministic identifier hashing and uniqueness verification.
- 🏷️ **Smart Auto-Categorization**:
  - Rule-based keyword engine that associates transactions with categories (*Pix Transfers, Salary, Groceries, Dining, Ride-sharing/Uber, Subscriptions, Investments/RDB, Utilities, Credit Card Payments*).
- 📊 **Interactive Data Visualizations**:
  - **Chart 1 — Monthly Cash Flow (`MonthlyAreaChart`)**: Interactive daily area chart comparing **Incomes** (Green), **Bank Debits** (Red), and **Credit Card Expenses** (Purple) with flexible period selectors (7d, 30d, 90d, all) and rich hover tooltips.
  - **Chart 2 — Weekly Consumption Pattern (`WeeklyLineChart`)**: Day-of-week analysis (Monday to Sunday) with toggleable header cards to isolate credit card versus direct bank debits.
  - **Chart 3 — Savings & Goals Tracker (`SavingsTrendChart`)**: Tracks monthly allocations to reserve funds (*Caixinhas / RDB*) and calculates month-over-month growth percentage (`+X%`) and cumulative totals.
  - **Category Breakdown (`PieChart`)**: Clean donut chart showcasing the relative percentage of expenses.
- ⚓ **macOS-Style Dock Navigation**:
  - Floating bottom navigation bar integrated from **React Bits** using **Motion** with smooth spring magnification, tooltips, and active page indicators.
- 🌓 **Dark & Light Mode**:
  - Full theme switching with automatic system detection and persistent preference in `localStorage`.
- 📝 **Transaction Management**:
  - Full CRUD capabilities, paginated tables, instant search, and inline category dropdowns.

---

## 🏗️ Architecture & Tech Stack

```
finance-export/
├── backend/                # Java Spring Boot 3 REST API
│   ├── src/main/java/      # Application source code
│   │   ├── config/         # CORS & Database seeders
│   │   ├── controller/     # REST Endpoints (/api/transactions, /api/dashboard, /api/categories)
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── entity/         # JPA Entities (Transaction, Category)
│   │   ├── parser/         # CSV statement parsers (Account & Credit Card)
│   │   ├── repository/     # Spring Data JPA Repositories
│   │   └── service/        # Business logic & KPI aggregations
│   └── src/main/resources/ # application.properties
│
├── frontend/               # React 18 + Vite Single Page Application
│   ├── src/
│   │   ├── api/            # Axios API client
│   │   ├── components/     # UI Components, Cards, Modals, Tables
│   │   │   ├── charts/     # Specialized Recharts components
│   │   │   ├── Dock/       # React Bits Dock component (Motion)
│   │   │   └── ui/         # Reusable Shadcn-style primitives
│   │   ├── context/        # ThemeContext (Dark/Light mode)
│   │   └── utils/          # Currency & Date formatters
│   └── package.json
│
├── sample-files/           # Anonymized sample CSV files for testing
│   ├── nubank_extrato_exemplo.csv              # Bank statement sample
│   └── NU_fatura_cartao_exemplo.csv           # Credit card invoice sample
│
├── iniciar-tudo.bat        # 1-click Windows launcher (Backend + Frontend)
├── iniciar-backend.bat     # Backend launcher
├── iniciar-frontend.bat    # Frontend launcher
└── README.md
```

### Backend
- **Java 17** (Eclipse Temurin)
- **Spring Boot 3.2.5** (Web, Data JPA, Validation)
- **MySQL 8.0** Connector / HikariCP
- **Lombok**
- **JUnit 5**

### Frontend
- **React 18** + **Vite**
- **Tailwind CSS**
- **Motion / Framer Motion** (React Bits Dock)
- **Recharts**
- **Lucide React**
- **Axios**

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Java JDK 17+**
- **Apache Maven 3.8+**
- **Node.js 18+** & **npm**
- **MySQL Server 8.0+**

---

### 1. Database Setup

1. Open your MySQL client (e.g., MySQL Workbench or MySQL CLI):
   ```sql
   CREATE DATABASE IF NOT EXISTS finance_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Configure the environment variables required by `backend/src/main/resources/application.properties`:
   ```properties
   SPRING_DATASOURCE_URL=jdbc:mysql://HOST:3306/finance_db
   SPRING_DATASOURCE_USERNAME=YOUR_DATABASE_USER
   SPRING_DATASOURCE_PASSWORD=YOUR_DATABASE_PASSWORD
   ```

---

### 2. Running the Backend

Navigate to the `backend` folder and run with Maven:

```bash
cd backend
mvn spring-boot:run
```

The REST API will be available at: **`http://localhost:8080/api`**

---

### 3. Running the Frontend

Navigate to the `frontend` folder, install dependencies, and start the development server:

```bash
cd frontend
npm install
npm run dev
```

The Web Application will be available at: **`http://localhost:5173`**

---

### 4. 1-Click Launchers (Windows)

For convenience on Windows environments, pre-configured launcher scripts are provided:
- **`iniciar-tudo.bat`**: Launches both Backend and Frontend in separate windows simultaneously.
- **`iniciar-backend.bat`**: Starts only the Spring Boot backend.
- **`iniciar-frontend.bat`**: Starts only the Vite frontend dev server.

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/transactions/import/csv` | Uploads and parses a Bank Statement or Credit Card CSV file |
| `GET` | `/api/transactions` | Retrieves paginated transactions with optional filters (`startDate`, `endDate`, `type`, `search`) |
| `POST` | `/api/transactions` | Creates a new manual transaction |
| `PUT` | `/api/transactions/{id}` | Updates an existing transaction |
| `DELETE` | `/api/transactions/{id}` | Deletes a transaction |
| `GET` | `/api/dashboard/summary` | Returns total income, total expense, net balance, and count |
| `GET` | `/api/dashboard/daily-expenses` | Daily spending breakdown (Account vs Card vs Incomes) |
| `GET` | `/api/dashboard/weekly-expenses` | Day-of-week spending distribution (Monday to Sunday) |
| `GET` | `/api/dashboard/savings-trend` | Monthly savings breakdown for reserve funds (*Caixinhas / RDB*) |
| `GET` | `/api/dashboard/by-category` | Category expense summary with relative percentages |
| `GET` | `/api/categories` | Lists all available financial categories |

---

## 📄 CSV Format Examples

### 1. Bank Account Statement
```csv
Data,Valor,Identificador,Descrição
01/07/2026,1000.00,6a44e995-9de6-46bf-8434-8a1510f91ad8,Transferência recebida pelo Pix - Cliente Exemplo - •••.000.000-•• - BANCO (0341) Agência: 0001 Conta: 12345-6
03/07/2026,-1874.22,6a4766d3-dbbf-4c77-a60e-374b451b26aa,Pagamento de fatura
03/07/2026,-1117.61,6a476799-479f-4c4e-a7c0-a37a85166072,Aplicação RDB
```

### 2. Credit Card Invoice
```csv
date,title,amount
2026-06-27,Estabelecimento Comercial,"56,50"
2026-06-27,Uber - NuPay,"32,94"
2026-06-24,"Estorno de ""Apple.Com/Bill"" (Apple)","- 31,41"
2026-05-29,Pagamento recebido,"- 743,95"
```

---

## 🧪 Testing

Run backend unit tests:
```bash
cd backend
mvn test
```

Build the production frontend bundle:
```bash
cd frontend
npm run build
```

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
