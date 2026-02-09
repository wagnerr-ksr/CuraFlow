FROM node:18-alpine

# Arbeitsverzeichnis im Container
WORKDIR /app

# Abhängigkeiten kopieren und installieren
COPY package*.json ./
RUN npm install --production

# Restlichen Code kopieren
COPY . .

# Port (Express Standard oft 3000 oder 8080 - pass ihn ggf. an)
EXPOSE 3000

CMD ["npm", "start"]
