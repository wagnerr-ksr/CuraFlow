#!/bin/bash
# Railway Deployment Script
# This script automates the deployment process to Railway

set -e

echo "🚀 CuraFlow Railway Deployment Script"
echo "======================================"
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found!"
    echo "Install it with: npm install -g @railway/cli"
    echo "Or: brew install railway"
    exit 1
fi

echo "✅ Railway CLI found"
echo ""

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo "🔐 Please log in to Railway:"
    railway login
fi

echo "✅ Logged in to Railway"
echo ""

# Check if project is linked
if [ ! -f ".railway/config.json" ]; then
    echo "🔗 Linking Railway project..."
    railway link
fi

echo "✅ Project linked"
echo ""

# Install dependencies
echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

echo "✅ Dependencies installed"
echo ""

# Deploy
echo "🚀 Deploying to Railway..."
railway up

echo ""
echo "✨ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Set environment variables in Railway Dashboard"
echo "2. Configure MySQL database"
echo "3. Update frontend VITE_API_URL to your Railway URL"
echo ""
