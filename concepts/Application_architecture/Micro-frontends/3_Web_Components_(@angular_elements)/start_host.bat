@echo off
setlocal enabledelayedexpansion

title MFE Pattern 3: Host Portal (Port 4200)
color 0B

echo ======================================================================
echo    Starting Host Portal (Port 4200)
echo    Framework: Angular 22+ Embedding Web Components
echo ======================================================================
echo.

cd /d "%~dp0host"

:: Check node_modules
if not exist "node_modules\" (
    echo [ERROR] node_modules not found in host!
    pause
    exit /b 1
)

echo [OK] Launching Host Portal on port 4200...
call npm run start -- --port 4200 --open

if %ERRORLEVEL% neq 0 (
    color 0C
    echo [ERROR] Host portal dev server terminated with error code %ERRORLEVEL%.
    pause
)
