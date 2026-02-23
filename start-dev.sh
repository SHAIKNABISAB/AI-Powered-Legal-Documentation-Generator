#!/bin/bash

echo "🚀 Starting LegalEase Development Environment"
echo "=============================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check for .env file
if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env file not found!"
    echo "Creating from template..."
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env"
    echo "⚠️  IMPORTANT: Please edit backend/.env and add your GEMINI_API_KEY"
    echo ""
fi

# Setup Python virtual environment
echo "📦 Setting up Python backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -q -r requirements.txt

echo "✅ Backend setup complete"
echo ""

# Start backend in background
echo "🚀 Starting Flask backend on http://localhost:5000"
python app.py &
BACKEND_PID=$!

cd ..

# Setup and start frontend
echo ""
echo "📦 Setting up React frontend..."

if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
fi

echo "✅ Frontend setup complete"
echo ""
echo "🚀 Starting React frontend on http://localhost:5173"
echo ""
echo "=============================================="
echo "🎉 LegalEase is starting up!"
echo ""
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "=============================================="
echo ""

# Start frontend (this will block)
npm run dev

# Cleanup when frontend stops
kill $BACKEND_PID 2>/dev/null
echo ""
echo "👋 LegalEase servers stopped"