# 🚀 MEGA PERFORMANT DOCKERFILE per Stardew Overlay
FROM node:18-alpine

# Ottimizzazioni per performance
RUN apk add --no-cache dumb-init

# Crea directory app
WORKDIR /app

# Copia package files
COPY package*.json ./

# Installa dipendenze con cache ottimizzato
RUN npm ci --only=production && npm cache clean --force

# Copia il codice
COPY . .

# Crea utente non-root per sicurezza
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# Espone la porta
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/ || exit 1

# Avvia con dumb-init per gestione processi ottimale
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "auth-server.js"]