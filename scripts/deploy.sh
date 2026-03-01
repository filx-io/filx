#!/bin/bash
# ============================================================
# FilX.io — One-click Railway Deploy Script
# Usage: ./scripts/deploy.sh [environment]
# ============================================================
set -euo pipefail

ENV=${1:-production}
echo "🚀 Deploying FilX.io to Railway ($ENV)..."

# Check dependencies
command -v railway >/dev/null 2>&1 || { echo "❌ railway CLI not found. Install: npm i -g @railway/cli"; exit 1; }
command -v git >/dev/null 2>&1 || { echo "❌ git not found."; exit 1; }

# Ensure logged in
railway whoami >/dev/null 2>&1 || { echo "❌ Not logged in. Run: railway login"; exit 1; }

echo "✅ Railway CLI authenticated"

# Link project (first time only)
if [ ! -f ".railway" ]; then
    echo "📎 Linking to Railway project..."
    railway link
fi

# Run DB migrations before deploy
echo "🗄️  Running database migrations..."
railway run --service backend python -m alembic upgrade head

# Deploy all services
echo "📦 Deploying backend..."
railway up --service backend --detach

echo "📦 Deploying worker..."
railway up --service worker --detach

echo "📦 Deploying frontend..."
railway up --service frontend --detach

echo ""
echo "✅ FilX.io deployed successfully!"
echo "🌐 Backend:  https://api.filx.io"
echo "🌐 Frontend: https://filx.io"
echo ""
echo "📊 Monitor: railway logs --service backend"
echo "📊 Flower:  railway run --service worker celery flower"
