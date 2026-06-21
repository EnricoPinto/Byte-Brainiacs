@echo off
echo ========================================
echo  ByteBrainiacs - Setup Script
echo ========================================
echo.

REM Check Node.js
where node >nul 2>&1
IF ERRORLEVEL 1 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please download and install Node.js from: https://nodejs.org/en/download
    echo Choose the LTS version (v20.x). After install, re-run this script.
    pause
    exit /b 1
)

echo [OK] Node.js found:
node --version
echo.

REM Install Backend
echo [1/3] Installing backend dependencies...
cd backend
call npm install
IF ERRORLEVEL 1 (
    echo [ERROR] Backend npm install failed.
    pause
    exit /b 1
)
echo.

REM Seed Database
echo [2/3] Seeding admin user and sample data...
call npm run seed
echo.

REM Install Frontend
echo [3/3] Installing frontend dependencies...
cd ..\frontend
call npm install
IF ERRORLEVEL 1 (
    echo [ERROR] Frontend npm install failed.
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo To start the application:
echo   Terminal 1 (Backend):   cd backend  ^&^& npm run dev
echo   Terminal 2 (Frontend):  cd frontend ^&^& npm run dev
echo.
echo Admin Login: admin@bytebrainiacs.com / Admin@1234
echo App URL: http://localhost:5173
echo.
pause
