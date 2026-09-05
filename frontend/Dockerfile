# ==========================================
# Stage 1: Build do Frontend com Node.js
# ==========================================
FROM node:18-alpine AS builder

WORKDIR /app

# Copia arquivos de dependencias
COPY package*.json ./

# Instala dependencias do projeto
RUN npm install

# Copia o codigo-fonte
COPY . .

# Executa build de producao
RUN npm run build

# ==========================================
# Stage 2: Servidor Web Nginx
# ==========================================
FROM nginx:alpine

# Remove configuracao padrao do Nginx
RUN rm -rf /etc/nginx/conf.d/*

# Copia arquivo de configuracao customizado
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia arquivos estaticos compilados do build
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
