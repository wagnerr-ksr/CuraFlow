# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app

# Umgebungsvariable für Vite während des Builds
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve mit Nginx
FROM nginx:stable-alpine
# Kopiere den Build-Output von Vite (meistens 'dist')
COPY --from=build /app/dist /usr/share/nginx/html
# Standard Nginx Config überschreiben (optional, für React Router Support)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
