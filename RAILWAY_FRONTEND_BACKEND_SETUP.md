# 🚀 Railway: Frontend + Backend Setup

## ✅ Aktuelle Architektur (Vereinfacht!)

```
Frontend (React/Vite)
    ↓
Railway API Client (/src/api/client.js)
    ↓
Railway Backend (Express.js)
    ↓
MySQL Database
```

**Keine Adapter mehr! Direkte API-Kommunikation.**

---

## ✅ Deine Situation

- **Frontend**: Bereits auf Railway (via GitHub)
- **Backend**: Migration von Base44 → Railway

---

## 📦 Setup in 3 Schritten

### 1️⃣ Backend-Service auf Railway erstellen

Im [Railway Dashboard](https://railway.app):

1. **Öffne dein Projekt** (wo dein Frontend bereits läuft)
2. Klick **"+ New"** → **"Empty Service"**  
3. Name: `CuraFlow-Backend` oder `API`
4. **Settings** → **Source** → **Connect Repo**
   - Repository: `andreasknopke/CuraFlow`
   - **Root Directory**: `/server`
   - **Builder**: Wähle **Metal** ✅ (schneller, empfohlen)
   - **Start Command**: `npm start`
   - **Watch Paths**: `/server/**`
5. **Settings** → **Networking** → **Generate Domain**
6. **Notiere die Backend-URL** (z.B. `curaflow-api.railway.app`)

### 2️⃣ MySQL Datenbank hinzufügen

Im gleichen Projekt:

1. **"+ New"** → **"Database"** → **"Add MySQL"**
2. Warte bis **Status: Active** (grün)
3. Klick auf MySQL Service → **Variables** Tab
4. **Notiere diese Werte:**
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`

### 3️⃣ Environment Variables setzen

#### Backend Service → Variables

Klick **"Raw Editor"** und füge ein:

```env
MYSQL_HOST=${{MYSQLHOST}}
MYSQL_PORT=${{MYSQLPORT}}
MYSQL_USER=${{MYSQLUSER}}
MYSQL_PASSWORD=${{MYSQLPASSWORD}}
MYSQL_DATABASE=${{MYSQLDATABASE}}
JWT_SECRET=<dein-secret-hier>
NODE_ENV=production
FRONTEND_URL=https://deine-frontend-url.railway.app
```

**JWT Secret generieren:**
```bash
openssl rand -hex 32
```

#### Frontend Service → Variables

Füge hinzu (oder aktualisiere):

```env
VITE_API_URL=https://deine-backend-url.railway.app
```

💡 **Wichtig:** Nach Änderung von Environment Variables muss Frontend neu deployen!
- Railway Dashboard → Frontend Service → Deployments → "Redeploy"
- Oder: Dummy-Commit pushen um Rebuild zu triggern

💡 Railway deployed automatisch bei Git Push!

---

## 🧪 Testen

### Health Check
```bash
curl https://deine-backend-url.railway.app/health
```

**Erwartete Antwort:**
```json
{"status":"ok","timestamp":"...","environment":"production"}
```

### Im Frontend
1. Öffne deine App
2. DevTools → Network Tab
3. Login versuchen
4. Requests sollten an Backend-URL gehen

---

## 🏗️ Architektur

```
Railway Projekt
├── Frontend Service (Vite)
│   └── https://deine-app.railway.app
│
├── Backend Service (Express)
│   └── https://deine-api.railway.app
│
└── MySQL Database
    └── Private Network
```

---

## 🔧 Troubleshooting

### CORS Error
→ Setze `FRONTEND_URL` im Backend Service exakt auf deine Frontend-URL

### Backend startet nicht
→ Prüfe Logs: Railway Dashboard → Backend Service → Logs  
→ Häufig: MySQL Credentials falsch oder JWT_SECRET fehlt

### Frontend findet Backend nicht
→ Prüfe `VITE_API_URL` in Frontend Variables  
→ Frontend muss nach Variable-Änderung neu deployen

---

## 🚀 Deployment-Workflow

Bei Git Push:
- Änderung in `/server/**` → Backend deployed
- Änderung in `/src/**` → Frontend deployed
- Railway erkennt automatisch!

---

## 📊 Environment Variables Übersicht

### Backend
| Variable | Quelle |
|----------|--------|
| `MYSQL_*` | MySQL Service (via Reference) |
| `JWT_SECRET` | Generiert mit `openssl rand -hex 32` |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | Deine Frontend Railway URL |

### Frontend
| Variable | Wert |
|----------|------|
| `VITE_API_URL` | Backend Railway URL |

**Hinweis:** `VITE_USE_RAILWAY` wird nicht mehr benötigt - das System nutzt jetzt ausschließlich Railway!

---

## 💰 Kosten
- Frontend: ~$0-5/Monat
- Backend: ~$5-10/Monat  
- MySQL: ~$5/Monat
- **Total: ~$10-20/Monat**

---

## 📚 Weitere Infos
- Detaillierte Anleitung: [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md)
- Railway Docs: https://docs.railway.app
- Discord Support: https://discord.gg/railway

---

**🎉 Fertig! Dein Full-Stack App läuft auf Railway.**
