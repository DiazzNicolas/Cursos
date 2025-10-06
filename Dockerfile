# Etapa 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependencias (sin producción para compilar)
RUN npm install && npm cache clean --force

# Copiar código fuente
COPY src ./src

# Compilar TypeScript
RUN npm install -g typescript && npm run build

# Etapa 2: Producción
FROM node:18-alpine

WORKDIR /app

# Crear usuario no root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copiar artefactos del build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Cambiar a usuario seguro
USER nodejs

# Exponer puerto
EXPOSE 3001

# Healthcheck para verificar que el servidor responda
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', r => process.exit(r.statusCode === 200 ? 0 : 1))"

# Comando de inicio
CMD ["node", "dist/index.js"]
