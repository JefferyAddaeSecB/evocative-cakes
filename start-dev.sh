#!/bin/bash

# Evocative Cakes - Development Server Starter
# This script starts both the frontend (Vite) and backend (Express) servers

echo "🚀 Starting Evocative Cakes development servers..."
echo ""

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "npm run dev" 2>/dev/null
pkill -f "tsx server" 2>/dev/null
sleep 2

# Start backend server in background
echo "📡 Starting backend server on port 3001..."
npx tsx server.ts &
BACKEND_PID=$!
sleep 3

# Start frontend server in background
echo "🎨 Starting frontend (Vite) on port 3000..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers are running!"
echo ""
echo "Frontend:  http://localhost:3000"
echo "Backend:   http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for interruption
wait

# Cleanup
kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
echo "✅ Servers stopped"
