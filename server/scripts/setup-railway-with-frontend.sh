#!/bin/bash
# Railway Frontend + Backend Deployment Helper
# Für Nutzer, die Frontend bereits auf Railway haben

set -e

echo "🚀 CuraFlow Railway Setup (Frontend bereits deployed)"
echo "======================================================"
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI nicht gefunden!"
    echo ""
    echo "Installation:"
    echo "  npm install -g @railway/cli"
    echo "  oder: brew install railway (Mac)"
    exit 1
fi

echo "✅ Railway CLI gefunden"
echo ""

# Login check
if ! railway whoami &> /dev/null; then
    echo "🔐 Bitte bei Railway einloggen:"
    railway login
fi

echo "✅ Eingeloggt als: $(railway whoami)"
echo ""

# Ask for URLs
echo "📝 Konfiguration"
echo "================"
echo ""
read -p "Frontend URL (z.B. https://curaflow.railway.app): " FRONTEND_URL
read -p "Backend URL (wird erstellt, z.B. curaflow-api): " BACKEND_NAME
echo ""

# Link to project
echo "🔗 Projekt verbinden..."
railway link
echo ""

# Install dependencies
echo "📦 Dependencies installieren..."
cd server
npm install
cd ..
echo ""

# Generate JWT Secret
JWT_SECRET=$(openssl rand -hex 32)
echo "🔑 JWT Secret generiert"
echo ""

# Deploy backend
echo "🚀 Backend deployen..."
cd server
railway up
cd ..
echo ""

# Set environment variables
echo "⚙️  Environment Variables setzen..."
echo ""
echo "Bitte setze folgende Variables im Railway Dashboard:"
echo ""
echo "BACKEND SERVICE → Variables:"
echo "  FRONTEND_URL=$FRONTEND_URL"
echo "  JWT_SECRET=$JWT_SECRET"
echo "  NODE_ENV=production"
echo "  (MySQL Variables werden automatisch verlinkt)"
echo ""
echo "FRONTEND SERVICE → Variables:"
echo "  VITE_API_URL=https://$BACKEND_NAME.railway.app"
echo "  VITE_USE_RAILWAY=true"
echo ""
echo "✨ Setup abgeschlossen!"
echo ""
echo "Nächste Schritte:"
echo "1. Gehe zu Railway Dashboard"
echo "2. Backend Service → Variables setzen"
echo "3. Frontend Service → Variables setzen"
echo "4. Teste: curl https://$BACKEND_NAME.railway.app/health"
echo ""
