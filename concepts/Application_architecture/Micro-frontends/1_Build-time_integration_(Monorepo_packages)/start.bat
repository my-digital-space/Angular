@echo off
setlocal enabledelayedexpansion

title MFE Pattern 1: Build-Time Integration (Host Shell)
color 0B

echo ======================================================================
echo    Pattern 1: Build-Time Integration (Monorepo Workspace Packages)
echo    Framework: Angular 22+ (Production Grade)
echo ======================================================================
echo.

:: 1. Check Node.js
echo [1/3] Checking Node.js installation...
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    color 0C
    echo [ERROR] Node.js is not found in PATH!
    echo Please install Node.js 20+ to run this Angular 22 project.
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('node -v') do set NODE_VER=%%v
echo [OK] Node.js version: %NODE_VER%
echo.

:: 2. Check Dependencies in host folder
echo [2/3] Checking dependencies in host application...
cd /d "%~dp0host"
if not exist "node_modules\" (
    echo [INFO] node_modules not found. Installing dependencies...
    call npm install --legacy-peer-deps
    if %ERRORLEVEL% neq 0 (
        color 0C
        echo [ERROR] npm install failed!
        pause
        exit /b 1
    )
) else (
    echo [OK] Dependencies already installed.
)
echo.

:: 3. Start Angular Development Server
echo [3/3] Starting Angular 22 Host Shell on http://localhost:4200...
echo.
echo ----------------------------------------------------------------------
echo  Server URL: http://localhost:4200
echo  Press Ctrl+C to stop the development server.
echo ----------------------------------------------------------------------
echo.

call npm run start -- --port 4200 --open

if %ERRORLEVEL% neq 0 (
    color 0C
    echo.
    echo [ERROR] Failed to start Angular development server!
    pause
    exit /b %ERRORLEVEL%
)

pause
