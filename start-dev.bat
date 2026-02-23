@echo off
chcp 65001 >nul
echo 🚀 Starting LegalEase Development Environment
echo ==============================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18 or higher.
    pause
    exit /b 1
)

REM Check for .env file
if not exist "backend\.env" (
    echo ⚠️  backend\.env file not found!
    echo Creating from template...
    copy backend\.env.example backend\.env
    echo ✅ Created backend\.env
    echo ⚠️  IMPORTANT: Please edit backend\.env and add your GEMINI_API_KEY
    echo.
    pause
)

REM Setup Python virtual environment
echo 📦 Setting up Python backend...
cd backend

if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install Python dependencies
echo Installing Python dependencies...
pip install -q -r requirements.txt

echo ✅ Backend setup complete
echo.

REM Start backend in background
echo 🚀 Starting Flask backend on http://localhost:5000
start "LegalEase Backend" python app.py

cd ..

REM Setup and start frontend
echo.
echo 📦 Setting up React frontend...

if not exist "node_modules" (
    echo Installing Node.js dependencies...
    call npm install
)

echo ✅ Frontend setup complete
echo.
echo 🚀 Starting React frontend on http://localhost:5173
echo.
echo ==============================================
echo 🎉 LegalEase is starting up!
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo.
echo Close this window to stop both servers
echo ==============================================
echo.

REM Start frontend
npm run dev

REM Cleanup
 taskkill /FI "WINDOWTITLE eq LegalEase Backend*" /F >nul 2>&1
echo.
echo 👋 LegalEase servers stopped
pause