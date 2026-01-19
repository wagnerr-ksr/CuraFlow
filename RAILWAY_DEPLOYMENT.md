# 🚀 CuraFlow Railway Deployment Guide

Vollständige Anleitung zur Migration von Base44 zu Railway

## 📋 Inhaltsverzeichnis

1. [Überblick](#überblick)
2. [Voraussetzungen](#voraussetzungen)
3. [Schnellstart (5 Minuten)](#schnellstart)
4. [Detaillierte Anleitung](#detaillierte-anleitung)
5. [Umgebungsvariablen](#umgebungsvariablen)
6. [Troubleshooting](#troubleshooting)

---

## Überblick

Diese Migration konvertiert dein CuraFlow-Backend von Base44 (serverless) zu Railway (Express/Node.js).

### Was wurde erstellt:

```
server/
├── index.js                      # Express-Server
├── package.json                  # Dependencies
├── routes/
│   ├── auth.js                   # JWT Authentication
│   ├── dbProxy.js               # Database Proxy
│   ├── schedule.js              # Dienstplan-Funktionen
│   ├── holidays.js              # Feiertage
│   ├── staff.js                 # Mitarbeiter
│   ├── calendar.js              # Kalender-Sync
│   ├── voice.js                 # Sprachbefehle
│   └── admin.js                 # Admin-Tools
└── scripts/
    ├── migrate-from-base44.js   # Migrations-Script
    ├── deploy-railway.sh        # Deployment-Script
    └── test-connection.js       # Verbindungstest

railway.json                      # Railway-Konfiguration
railway.toml                      # Alternative Konfiguration
Dockerfile                        # Docker-Build (optional)
```

---

## Voraussetzungen

### 1. Railway Account
- Erstelle einen Account auf [railway.app](https://railway.app)
- Verifiziere deine E-Mail

### 2. MySQL Datenbank auf Railway
- In Railway: **New Project** → **Provision MySQL**
- Notiere die Verbindungsdaten (Host, Port, User, Password, Database)

### 3. Lokale Tools
```bash
# Railway CLI installieren
npm install -g @railway/cli

# Oder mit Homebrew (Mac)
brew install railway

# Oder mit Scoop (Windows)
scoop install railway
```

---

## Schnellstart (5 Minuten)

### Schritt 1: Initialisierung
```bash
# Im Projekt-Root
cd /workspaces/CuraFlow

# Dependencies installieren
cd server
npm install
cd ..
```

### Schritt 2: Railway CLI Login
```bash
railway login
```

### Schritt 3: Projekt mit Railway verbinden
```bash
# In deinem Railway Dashboard: New Project → Empty Project erstellen
# Dann im Terminal:
railway link
# Wähle dein Projekt aus der Liste
```

### Schritt 4: MySQL Datenbank hinzufügen
```bash
# In Railway Dashboard:
# 1. Klick auf "+ New" → "Database" → "Add MySQL"
# 2. Warte bis MySQL bereit ist
# 3. Kopiere die Connection-Details
```

### Schritt 5: Umgebungsvariablen setzen
```bash
# Im Railway Dashboard → Variables Tab:
railway variables set MYSQL_HOST=containers-us-west-xxx.railway.app
railway variables set MYSQL_PORT=6543
railway variables set MYSQL_USER=root
railway variables set MYSQL_PASSWORD=xxxxx
railway variables set MYSQL_DATABASE=railway
railway variables set JWT_SECRET=$(openssl rand -hex 32)
railway variables set NODE_ENV=production
```

### Schritt 6: Deployen
```bash
railway up
```

### Schritt 7: URL abrufen
```bash
# URL wird automatisch generiert
railway domain

# Oder im Dashboard → Settings → Generate Domain
```

### Schritt 8: Frontend konfigurieren
```bash
# Erstelle .env.local im Root
cat > .env.local << EOL
VITE_API_URL=https://your-app.railway.app
VITE_USE_RAILWAY=true
EOL
```

✅ **Fertig!** Dein Backend läuft jetzt auf Railway.

---

## Detaillierte Anleitung

### Option A: Automatische Migration (empfohlen)

Das Migration-Script führt dich durch den Prozess:

```bash
node server/scripts/migrate-from-base44.js
```

Das Script fragt interaktiv nach:
- Railway Backend URL
- MySQL Credentials
- JWT Secret (oder generiert automatisch)

Es erstellt dann:
- `server/.env` mit Backend-Konfiguration
- `.env.local` mit Frontend-Konfiguration

### Option B: Manuelle Migration

#### 1. Server-Konfiguration

Erstelle `server/.env`:
```env
# MySQL Configuration (von Railway)
MYSQL_HOST=containers-us-west-123.railway.app
MYSQL_PORT=6543
MYSQL_USER=root
MYSQL_PASSWORD=dein-password
MYSQL_DATABASE=railway

# JWT Secret (generiere mit: openssl rand -hex 32)
JWT_SECRET=abcd1234...

# Server Config
PORT=3000
NODE_ENV=production
```

#### 2. Frontend-Konfiguration

Erstelle `.env.local` im Root:
```env
VITE_API_URL=https://your-app.railway.app
VITE_USE_RAILWAY=true
```

#### 3. Datenbank migrieren

Falls du Daten von Base44 migrierst:

```bash
# 1. Export von Base44 (falls vorhanden)
# Nutze Base44 Admin-Tools oder mysqldump

# 2. Import in Railway MySQL
mysql -h containers-us-west-123.railway.app \
      -P 6543 \
      -u root \
      -p railway < backup.sql
```

#### 4. Deployment-Methoden

**Methode 1: Railway CLI (schnellste)**
```bash
railway up
```

**Methode 2: GitHub Integration**
```bash
# In Railway Dashboard: 
# Settings → Connect GitHub → Select Repository → Deploy

# Bei jedem Push wird automatisch deployed
git add .
git commit -m "Add Railway backend"
git push
```

**Methode 3: Docker (für erweiterte Setups)**
```bash
# Baue Docker Image
docker build -t curaflow-railway .

# Push zu Railway
railway up --dockerfile Dockerfile
```

---

## Umgebungsvariablen

### Erforderlich

| Variable | Beschreibung | Beispiel |
|----------|-------------|----------|
| `MYSQL_HOST` | MySQL Host von Railway | `containers-us-west-123.railway.app` |
| `MYSQL_PORT` | MySQL Port | `6543` |
| `MYSQL_USER` | MySQL Benutzer | `root` |
| `MYSQL_PASSWORD` | MySQL Passwort | `xxx` |
| `MYSQL_DATABASE` | Datenbank Name | `railway` |
| `JWT_SECRET` | Secret für JWT-Token | `generiert-mit-openssl` |

### Optional

| Variable | Beschreibung | Standard |
|----------|-------------|----------|
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server Port (Railway setzt automatisch) | `3000` |
| `ELEVENLABS_API_KEY` | Für Voice-Features | - |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Für Calendar-Sync | - |

### Setzen via CLI

```bash
# Einzeln
railway variables set JWT_SECRET=mein-secret

# Mehrere gleichzeitig
railway variables set \
  MYSQL_HOST=host \
  MYSQL_USER=root \
  JWT_SECRET=secret
```

### Setzen via Dashboard

1. Öffne dein Projekt auf railway.app
2. Gehe zu **Variables** Tab
3. Klick **+ New Variable**
4. Gib Name und Wert ein
5. Klick **Add**

---

## Frontend-Integration

### Automatische Adapter-Auswahl

Der UnifiedAdapter wählt automatisch basierend auf `VITE_USE_RAILWAY`:

```javascript
// src/components/YourComponent.jsx
import { UnifiedAdapter } from '@/components/db/UnifiedAdapter';

const doctors = new UnifiedAdapter('doctors');

// Funktioniert mit Railway oder Base44
const allDoctors = await doctors.list();
```

### Manuell Railway verwenden

```javascript
import { RailwayAdapter } from '@/components/db/RailwayAdapter';

const doctors = new RailwayAdapter('doctors');
const list = await doctors.list();
```

### Authentication

```javascript
import { railwayAuth } from '@/api/railwayClient';

// Login
const { token, user } = await railwayAuth.login('email@example.com', 'password');

// Get current user
const currentUser = await railwayAuth.me();

// Update profile
await railwayAuth.updateMe({ full_name: 'Neuer Name' });
```

---

## Testen

### Lokaler Test

```bash
# Start local server
cd server
npm run dev

# In anderem Terminal: Test connection
node scripts/test-connection.js
```

### Railway Test

```bash
# Nach Deployment
RAILWAY_API_URL=https://your-app.railway.app node server/scripts/test-connection.js
```

### Health Check

```bash
curl https://your-app.railway.app/health
```

Erwartete Antwort:
```json
{
  "status": "ok",
  "timestamp": "2026-01-19T...",
  "environment": "production"
}
```

---

## Troubleshooting

### Problem: "Cannot connect to MySQL"

**Lösung:**
```bash
# 1. Prüfe Railway MySQL Status
railway status

# 2. Teste Connection direkt
mysql -h $MYSQL_HOST -P $MYSQL_PORT -u $MYSQL_USER -p

# 3. Verifiziere Environment Variables
railway variables
```

### Problem: "JWT Secret not set"

**Lösung:**
```bash
# Generiere und setze JWT Secret
railway variables set JWT_SECRET=$(openssl rand -hex 32)

# Redeploy
railway up
```

### Problem: "502 Bad Gateway"

**Mögliche Ursachen:**
1. Server startet nicht (Fehler in Logs)
2. PORT nicht korrekt gesetzt
3. Health Check schlägt fehl

**Lösung:**
```bash
# Logs ansehen
railway logs

# Sicherstellen dass PORT von Railway übernommen wird
# (Im index.js bereits implementiert: process.env.PORT || 3000)
```

### Problem: "CORS Error im Frontend"

**Lösung:**
In `server/index.js` CORS origin anpassen:
```javascript
app.use(cors({
  origin: [
    'https://your-frontend-domain.com',
    'http://localhost:5173'
  ],
  credentials: true
}));
```

Dann redeploy:
```bash
railway up
```

### Problem: "Database tables not found"

**Lösung:**
```bash
# 1. Prüfe ob Tabellen existieren
railway run mysql -e "SHOW TABLES"

# 2. Falls nicht: Import SQL
railway run mysql < schema.sql

# 3. Oder erstelle Tabellen manuell
railway run mysql < server/scripts/init-database.sql
```

### Problem: Frontend verbindet nicht

**Prüfe `.env.local`:**
```bash
cat .env.local
```

Sollte enthalten:
```
VITE_API_URL=https://your-app.railway.app
VITE_USE_RAILWAY=true
```

**Vite neu starten:**
```bash
npm run dev
```

---

## Performance-Optimierung

### 1. Connection Pooling

Bereits implementiert in `server/index.js`:
```javascript
export const db = createPool({
  connectionLimit: 10,
  queueLimit: 0
});
```

### 2. Caching

Tabellen-Spalten werden gecacht (in `dbProxy.js`).

### 3. Rate Limiting

15 Minuten / 100 Requests pro IP (in `index.js`).

### 4. Compression

Gzip-Kompression aktiviert für alle Responses.

---

## Monitoring

### Logs ansehen

```bash
# Live logs
railway logs

# Letzte 100 Zeilen
railway logs --tail 100
```

### Metrics

Im Railway Dashboard:
- **Metrics** Tab zeigt:
  - CPU Usage
  - Memory Usage
  - Network Traffic
  - Response Times

### Alerts

Railway kann Alerts senden bei:
- Deployment Failures
- High Resource Usage
- Downtime

Konfiguriere in: **Settings → Notifications**

---

## Kosten

### Railway Pricing (Stand 2026)

**Free Tier:**
- $5 Starter Credit (einmalig)
- Gut für Testing

**Pro Plan ($20/Monat):**
- $20 inkl. Credits
- Danach pay-as-you-go
- ~$0.000231 per GB transferred
- ~$10/month für small apps

**MySQL Database:**
- Shared: ~$5/month
- Dedicated: Ab $15/month

### Kostenvergleich

| Plattform | Small App | Medium App |
|-----------|-----------|------------|
| Railway | $10-15/mo | $25-40/mo |
| Base44 | Variable | Variable |
| Heroku | $7-25/mo | $25-50/mo |

---

## Nächste Schritte

### 1. Custom Domain

```bash
# In Railway Dashboard:
# Settings → Domains → Add Custom Domain
# Setze CNAME: your-app.railway.app
```

### 2. SSL/HTTPS

✅ Automatisch von Railway bereitgestellt

### 3. CI/CD

Mit GitHub Integration:
```yaml
# .github/workflows/railway.yml
name: Deploy to Railway
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install -g @railway/cli
      - run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

### 4. Monitoring erweitern

Services wie:
- Sentry (Error Tracking)
- LogRocket (Session Replay)
- Datadog (APM)

---

## Support

### Railway Support
- [Railway Docs](https://docs.railway.app)
- [Discord Community](https://discord.gg/railway)
- [Status Page](https://status.railway.app)

### CuraFlow Support
- GitHub Issues
- Projekt-Dokumentation

---

## Rollback zu Base44

Falls du zurückwechseln möchtest:

```bash
# 1. Entferne Railway-Flag
rm .env.local

# 2. Oder setze
echo "VITE_USE_RAILWAY=false" > .env.local

# 3. Frontend neu starten
npm run dev
```

Das System nutzt dann automatisch wieder Base44.

---

## Zusammenfassung

✅ **Vorteile Railway:**
- Vollständige Kontrolle über Backend
- Bessere Performance bei konstanter Last
- Einfacheres Debugging
- Längere Request-Timeouts
- WebSocket Support
- Direkte MySQL-Verbindung

✅ **Setup-Zeit:** 
- Automatisch: ~5 Minuten
- Manuell: ~15 Minuten

✅ **Maintenance:**
- Automatische Updates via Git
- Logs über Railway Dashboard
- Einfaches Scaling

---

**🎉 Viel Erfolg mit deinem Railway Deployment!**

Bei Fragen oder Problemen, siehe Troubleshooting-Sektion oder öffne ein Issue.
