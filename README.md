# 💳 FinanceExport — Personal Finance & Statement Management System

[![Version: 0.4.0](https://img.shields.io/badge/version-0.4.0-blue.svg)](CHANGELOG.md)
[![Java 17](https://img.shields.io/badge/Java-17-orange.svg)](https://adoptium.net/)
[![Spring Boot 3](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![MySQL 8.0](https://img.shields.io/badge/MySQL-8.0-4479A1.svg)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED.svg)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern, full-stack personal finance application built to import, parse, intelligently categorize, and visualize banking transactions from **bank statements** and **credit card invoices (CSV format)**.

Designed with a clean, responsive user interface featuring an interactive sidebar, rich **Recharts** data visualizations, dark mode support, and an enterprise-grade **Java Spring Boot 3 + MySQL** backend.

---

## ✨ Features

- 📥 **Multi-format CSV Importer**:
  - Automatically identifies and parses **Bank Account Statements** (`Data,Valor,Identificador,Descrição`) and **Credit Card Invoices** (`date,title,amount`).
  - Supports Brazilian currency formatting (`R$ 1.234,56`), multiple date patterns (`dd/MM/yyyy`, `yyyy-MM-dd`), refunds (negative values), and installments.
- 🛡️ **Deduplication Engine**:
  - Prevents duplicate entries when importing overlapping statement periods via deterministic identifier hashing and uniqueness verification.
- 🏷️ **Smart Auto-Categorization & Interactive Filters**:
  - Rule-based keyword engine that associates transactions with categories (*Pix Transfers, Salary, Groceries, Dining, Ride-sharing/Uber, Subscriptions, Investments/RDB, Utilities, Credit Card Payments*).
  - Click any category in the Donut Chart to filter the entire dashboard by that category.
- 📊 **Interactive Data Visualizations**:
  - **Chart 1 — Monthly Cash Flow (`MonthlyAreaChart`)**: Interactive daily area chart comparing **Incomes** (Green) and **Expenses** (Red), with click-to-view day details (`DayMovementsDialog`).
  - **Chart 2 — Weekly Consumption Pattern (`WeeklyLineChart`)**: Day-of-week analysis (Monday to Sunday) with toggleable cards for credit card versus direct bank debits.
  - **Chart 3 — Savings & Goals Tracker (`SavingsTrendChart`)**: Tracks monthly allocations to reserve funds (*Caixinhas / RDB*) and calculates month-over-month growth percentage (`+X%`).
  - **Category Breakdown (`PieChart`)**: Clean donut chart positioned side-by-side with cash flow on large screens.
- 🧭 **Responsive Sidebar & Navigation**:
  - Minimizable sidebar (collapsible between 72px and 288px) with persistence in `localStorage`, mobile drawer, and dedicated Changelog page.
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
│   ├── Dockerfile          # Multi-stage Docker build for Spring Boot
│   └── src/main/resources/ # application.properties
│
├── frontend/               # React 18 + Vite Single Page Application
│   ├── src/
│   │   ├── api/            # Axios API client
│   │   ├── components/     # UI Components, Cards, Modals, Tables, Charts, Sidebar
│   │   ├── context/        # ThemeContext (Dark/Light mode)
│   │   └── utils/          # Currency & Date formatters
│   ├── Dockerfile          # Multi-stage Docker build for React + Nginx
│   ├── nginx.conf          # Nginx reverse proxy configuration
│   └── package.json
│
├── sample-files/           # Anonymized sample CSV files for testing
│   ├── nubank_extrato_exemplo.csv              # Bank statement sample
│   └── NU_fatura_cartao_exemplo.csv           # Credit card invoice sample
│
├── CHANGELOG.md            # Release notes and version history
├── docker-compose.yml      # Orchestrates MySQL 8, Backend, and Frontend
├── iniciar-docker.bat      # 1-click Docker launcher for Windows
├── iniciar-tudo.bat        # 1-click Windows launcher (Local dev)
├── iniciar-backend.bat     # Backend local launcher
├── iniciar-frontend.bat    # Frontend local launcher
└── README.md
```

---

## 🚀 Quick Start with Docker (Recommended)

The easiest way to run the entire system on **any computer (Windows, macOS, Linux)** without installing Java, Maven, Node.js, or MySQL:

### 1. Prerequisites
- Install **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** and ensure it is running.

### 2. Run with One Command

Open your terminal in the project directory:

```bash
docker compose up -d --build
```

*(On Windows, you can also simply double-click **`iniciar-docker.bat`**)*

### 3. Access the Application

| Service | URL | Notes |
|---|---|---|
| **Web Frontend** | **`http://localhost:5173`** or **`http://localhost`** | Ready to use in your browser |
| **Backend REST API** | **`http://localhost:8080/api`** | API documentation and endpoints |
| **MySQL Database** | **`localhost:3307`** | User: `root` \| Password: `root` \| DB: `finance_db` |

### Useful Docker Commands

```bash
# View live logs from all services
docker compose logs -f

# View logs from a specific service (e.g. backend)
docker compose logs -f backend

# Check container status
docker compose ps

# Stop all services (data is preserved in the Docker volume)
docker compose down

# Stop and delete the database volume (reset all data)
docker compose down -v
```

---

## 🛠️ Alternative: Manual Local Setup (Without Docker)

If you prefer to run the project directly on your machine without Docker:

### Prerequisites
- **Java JDK 17+**
- **Apache Maven 3.8+**
- **Node.js 18+** & **npm**
- **MySQL Server 8.0+**

### 1. Database Setup
Create the database in MySQL:
```sql
CREATE DATABASE IF NOT EXISTS finance_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

*(Optional)* If your local MySQL credentials differ from `root`/`root`, set environment variables:
```properties
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/finance_db
SPRING_DATASOURCE_USERNAME=your_user
SPRING_DATASOURCE_PASSWORD=your_password
```

### 2. Running the Backend
```bash
cd backend
mvn spring-boot:run
```

### 3. Running the Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/transactions/import/csv` | Uploads and parses a Bank Statement or Credit Card CSV file |
| `GET` | `/api/transactions` | Retrieves paginated transactions with optional filters (`startDate`, `endDate`, `type`, `search`) |
| `POST` | `/api/transactions` | Creates a new manual transaction |
| `PUT` | `/api/transactions/{id}` | Updates an existing transaction |
| `DELETE` | `/api/transactions/{id}` | Deletes a transaction |
| `GET` | `/api/dashboard/summary` | Returns total income, total expense, net balance, and count (supports optional `categoryId`) |
| `GET` | `/api/dashboard/daily-expenses` | Daily spending breakdown (Account vs Card vs Incomes, supports optional `categoryId`) |
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
