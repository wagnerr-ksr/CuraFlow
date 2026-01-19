# Railway Migration Quick Reference

## 🚀 Schnellstart-Befehle

```bash
# 1. Railway CLI installieren
npm install -g @railway/cli

# 2. Login
railway login

# 3. Dependencies installieren
cd server && npm install && cd ..

# 4. Projekt verbinden
railway link

# 5. MySQL hinzufügen (im Dashboard)
# New → Database → MySQL

# 6. Umgebungsvariablen setzen
railway variables set JWT_SECRET=$(openssl rand -hex 32)
railway variables set NODE_ENV=production

# 7. Deployen
railway up

# 8. URL abrufen
railway domain

# 9. Frontend konfigurieren
echo "VITE_API_URL=https://your-app.railway.app" > .env.local
echo "VITE_USE_RAILWAY=true" >> .env.local
```

## 📁 Wichtige Dateien

| Datei | Zweck |
|-------|-------|
| `server/index.js` | Express Server |
| `server/routes/auth.js` | Authentication |
| `server/routes/dbProxy.js` | Database Proxy |
| `railway.json` | Railway Config |
| `RAILWAY_DEPLOYMENT.md` | Vollständige Anleitung |
| `server/scripts/migrate-from-base44.js` | Migrations-Tool |

## 🔧 Nützliche Befehle

```bash
# Logs ansehen
railway logs

# Status prüfen
railway status

# Variablen auflisten
railway variables

# Lokal testen
cd server && npm run dev

# Connection testen
node server/scripts/test-connection.js
```

## 📞 Support

- 📖 Vollständige Anleitung: `RAILWAY_DEPLOYMENT.md`
- 🌐 Railway Docs: https://docs.railway.app
- 💬 Discord: https://discord.gg/railway
