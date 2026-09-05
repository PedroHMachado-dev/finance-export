# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.3.0] - 2026-09-05

### Added
- **Docker Compose Orchestration**: Full containerization running MySQL 8.0, Spring Boot 3 Backend, and React Frontend with a single command (`docker compose up -d --build`).
- **Multi-Stage Dockerfiles**:
  - `backend/Dockerfile`: Uses `maven:3.9.6-eclipse-temurin-17` for isolated builds and `eclipse-temurin:17-jre-alpine` for a lightweight, secure runtime container.
  - `frontend/Dockerfile`: Uses `node:18-alpine` for Vite production bundling and `nginx:alpine` for high-performance static serving.
- **Nginx Reverse Proxy**: Automatic proxy pass for `/api/` requests directly to `backend:8080`, eliminating browser CORS issues entirely in containerized environments.
- **Persistent MySQL Storage**: Configured `finance_mysql_data` named Docker volume to guarantee zero data loss across container stops, restarts, and image updates.
- **1-Click Windows Launcher**: Added `iniciar-docker.bat` with automated Docker daemon status checking and colorized status feedback.
- **In-App Release Notes**: Added `v0.3.0` Docker Release card and updated version badge in the application footer.
- **Expanded Date Filtering**: Added `2026-09` (September 2026) and `2026-08` (August 2026) options across all dashboard and transaction period selectors.

### Changed
- **MySQL Host Port Mapping**: Mapped container MySQL to host port `3307:3306` to prevent port collisions with existing native Windows MySQL services on port `3306`.
- **Dynamic Period Selection**: Refactored `DashboardService.java` to dynamically select the latest month containing movements when no explicit period is provided, instead of hardcoding past dates.
- **Hybrid Configuration**: Updated `backend/src/main/resources/application.properties` with environment variable fallbacks (`${SPRING_DATASOURCE_URL:...}`) allowing seamless switching between local and Docker execution.
- **Documentation Overhaul**: Updated `README.md` with complete Docker quick start instructions, port mappings, and operational command reference.

---

## [0.2.0] - 2026-09-02

### Added
- **Responsive Sidebar**: Collapsible, minimizable navigation bar (72px to 288px) with mobile drawer and `localStorage` persistence.
- **Interactive Day Breakdown**: Modal dialog (`DayMovementsDialog`) triggered when clicking any date on the monthly cash flow chart.
- **Donut Chart Category Filtering**: Instant global dashboard filtering by clicking individual slices of the category distribution chart.
- **Dark & Light Themes**: Persistent theme switching with automatic system preference detection.
- **Changelog View**: Integrated changelog tab to document version history directly within the web app.

### Changed
- **Clean Comparative Layout**: Repositioned charts for higher screen resolutions and aligned category breakdown alongside cash flow.
- **Investment Exclusions**: Adjusted accounting logic to exclude investments, RDB, and Caixinhas from operational expense totals.
- **Sanitized Configurations**: Replaced sensitive personal database credentials with portable generic defaults.

---

## [0.1.0] - 2026-08-22

### Added
- **Multi-Format CSV Importers**: Dedicated parsers for Nubank bank account statements and credit card invoices.
- **Deterministic Deduplication**: Unique identifier hashing preventing duplicate entries during overlapping statement imports.
- **Auto-Categorization Rules**: Keyword-based classification engine for financial transactions.
- **Full-Stack REST Architecture**: Spring Boot 3, Spring Data JPA, Hibernate, MySQL 8, React 18, Tailwind CSS, and Recharts.
- **Transaction Management**: Searchable, paginated transaction table with full CRUD capabilities and inline category edits.
