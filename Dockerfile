FROM node:18-alpine

WORKDIR /app

# Copy server files
COPY server/package*.json ./server/
RUN cd server && npm install --production

COPY server ./server

WORKDIR /app/server

EXPOSE 3000

CMD ["npm", "start"]
