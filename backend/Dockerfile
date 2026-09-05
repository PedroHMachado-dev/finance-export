# ==========================================
# Stage 1: Build da aplicacao com Maven
# ==========================================
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /app

# Copia pom.xml e codigo-fonte
COPY pom.xml .
COPY src ./src

# Compila o projeto e gera o pacote .jar sem rodar testes
RUN mvn clean package -DskipTests -B

# ==========================================
# Stage 2: Imagem leve de execucao (JRE)
# ==========================================
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Cria usuario nao-root para seguranca
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copia o .jar compilado do estagio anterior
COPY --from=builder /app/target/finance-control-*.jar app.jar

# Ajusta permissoes
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
