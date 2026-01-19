#!/bin/bash
# Quick Railway Backend Debug Script

echo "🔍 Railway Backend Debugging"
echo "============================"
echo ""

# Get Backend URL from user
read -p "Backend Railway URL (z.B. curaflow-api.railway.app): " BACKEND_URL

# Remove https:// if present
BACKEND_URL=${BACKEND_URL#https://}
BACKEND_URL=${BACKEND_URL#http://}

echo ""
echo "Testing: https://$BACKEND_URL"
echo ""

# Test 1: Health Check
echo "1️⃣ Health Check..."
HEALTH=$(curl -s -w "\n%{http_code}" "https://$BACKEND_URL/health")
HTTP_CODE=$(echo "$HEALTH" | tail -n1)
RESPONSE=$(echo "$HEALTH" | sed '$d')

echo "Status Code: $HTTP_CODE"
echo "Response: $RESPONSE"
echo ""

if [ "$HTTP_CODE" != "200" ]; then
    echo "❌ Backend antwortet nicht korrekt!"
    echo ""
    echo "Mögliche Probleme:"
    echo "- Backend ist nicht gestartet"
    echo "- Environment Variables fehlen"
    echo "- Build/Start Command falsch"
    echo ""
    echo "Prüfe Railway Logs: Railway Dashboard → Backend Service → Logs"
    exit 1
fi

# Test 2: Auth Verify Endpoint
echo "2️⃣ Auth Verify Endpoint..."
AUTH=$(curl -s -w "\n%{http_code}" "https://$BACKEND_URL/api/auth/verify")
HTTP_CODE=$(echo "$AUTH" | tail -n1)
RESPONSE=$(echo "$AUTH" | sed '$d')

echo "Status Code: $HTTP_CODE"
echo "Response: $RESPONSE"
echo ""

# Test 3: CORS Check
echo "3️⃣ CORS Check..."
read -p "Frontend URL (z.B. curaflow.railway.app): " FRONTEND_URL
FRONTEND_URL=${FRONTEND_URL#https://}
FRONTEND_URL=${FRONTEND_URL#http://}

CORS=$(curl -s -I -H "Origin: https://$FRONTEND_URL" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     "https://$BACKEND_URL/api/auth/login")

echo "$CORS" | grep -i "access-control"
echo ""

if echo "$CORS" | grep -q "Access-Control-Allow-Origin"; then
    echo "✅ CORS ist konfiguriert"
else
    echo "❌ CORS Problem!"
    echo ""
    echo "Lösung:"
    echo "Backend Service → Variables → FRONTEND_URL setzen:"
    echo "FRONTEND_URL=https://$FRONTEND_URL"
fi

echo ""
echo "4️⃣ Test Login Request..."
LOGIN=$(curl -s -w "\n%{http_code}" \
     -H "Content-Type: application/json" \
     -H "Origin: https://$FRONTEND_URL" \
     -X POST \
     -d '{"email":"test@test.de","password":"test"}' \
     "https://$BACKEND_URL/api/auth/login")

HTTP_CODE=$(echo "$LOGIN" | tail -n1)
RESPONSE=$(echo "$LOGIN" | sed '$d')

echo "Status Code: $HTTP_CODE"
echo "Response: $RESPONSE"
echo ""

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "401" ]; then
    echo "✅ Backend funktioniert! (401 = falsche Credentials ist OK)"
else
    echo "❌ Backend Problem bei Login"
fi
