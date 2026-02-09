FROM node:18-alpine

# Arbeitsverzeichnis im Container
WORKDIR /app

# Abhängigkeiten kopieren und installieren
COPY server/package*.json ./
RUN npm install --production

# Restlichen Code kopieren
COPY server/ .

# Port (Express Standard oft 3000 oder 8080 - pass ihn ggf. an)
EXPOSE 3000

CMD ["npm", "start"]
