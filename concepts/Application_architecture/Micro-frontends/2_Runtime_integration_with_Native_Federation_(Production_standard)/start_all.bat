@echo off
setlocal enabledelayedexpansion

title MFE Pattern 2: Runtime Native Federation Multi-Server Orchestrator
color 0A

echo ==============================================================================
echo       PATTERN 2: RUNTIME INTEGRATION WITH NATIVE FEDERATION (ANGULAR 22+)
echo                     Multi-Application Server Startup
echo ==============================================================================
echo.

:: 1. Verify Node.js Environment
echo [1/5] Checking Node.js installation...
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    color 0C
    echo [FATAL ERROR] Node.js is not found in PATH.
    echo Please install Node.js 20+ to proceed.
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('node -v') do set NODE_VERSION=%%v
echo [OK] Node.js version: %NODE_VERSION%
echo.

:: 2. Verify all 3 project directories
echo [2/5] Validating project directories and configurations...
if not exist "%~dp0host\angular.json" (
    color 0C
    echo [ERROR] host directory or angular.json is missing!
    pause
    exit /b 1
)
if not exist "%~dp0orders-mfe\angular.json" (
    color 0C
    echo [ERROR] orders-mfe directory or angular.json is missing!
    pause
    exit /b 1
)
if not exist "%~dp0billing-mfe\angular.json" (
    color 0C
    echo [ERROR] billing-mfe directory or angular.json is missing!
    pause
    exit /b 1
)
echo [OK] All 3 projects detected: host (4200), orders-mfe (4201), billing-mfe (4202).
echo.

:: 3. Launch Remote 1: Orders MFE (Port 4201)
echo [3/5] Starting Remote 1: Orders MFE on Port 4201...
start "MFE Remote 1: Orders (Port 4201)" cmd /c "%~dp0start_orders.bat"
if %ERRORLEVEL% neq 0 (
    color 0C
    echo [WARNING] Failed to spawn orders-mfe window!
) else (
    echo [OK] Orders MFE process launched in dedicated terminal.
)
timeout /t 3 /nobreak >nul
echo.

:: 4. Launch Remote 2: Billing MFE (Port 4202)
echo [4/5] Starting Remote 2: Billing MFE on Port 4202...
start "MFE Remote 2: Billing (Port 4202)" cmd /c "%~dp0start_billing.bat"
if %ERRORLEVEL% neq 0 (
    color 0C
    echo [WARNING] Failed to spawn billing-mfe window!
) else (
    echo [OK] Billing MFE process launched in dedicated terminal.
)
timeout /t 3 /nobreak >nul
echo.

:: 5. Launch Host Shell (Port 4200)
echo [5/5] Starting Host Shell on Port 4200...
echo.
echo ------------------------------------------------------------------------------
echo  Active Endpoints:
echo    • Host Shell:   http://localhost:4200  (Entrypoint)
echo    • Orders MFE:   http://localhost:4201  (Remote 1)
echo    • Billing MFE:  http://localhost:4202  (Remote 2)
echo.
echo  Closing this orchestrator window will NOT terminate the individual remotes.
echo  To shut down, close each individual terminal window.
echo ------------------------------------------------------------------------------
echo.

start "MFE Host Shell (Port 4200)" cmd /c "%~dp0start_host.bat"

echo All 3 servers have been initialized. Check each terminal window for build status.
pause
