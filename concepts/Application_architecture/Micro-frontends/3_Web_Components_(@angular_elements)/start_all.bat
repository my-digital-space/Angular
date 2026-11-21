@echo off
setlocal enabledelayedexpansion

title MFE Pattern 3: Web Components Multi-Server Orchestrator
color 0A

echo ==============================================================================
echo        PATTERN 3: WEB COMPONENTS WITH @ANGULAR/ELEMENTS (ANGULAR 22+)
echo                     Multi-Application Server Startup
echo ==============================================================================
echo.

:: 1. Verify Node.js Environment
echo [1/4] Checking Node.js installation...
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

:: 2. Validate Projects
echo [2/4] Validating host and chat-widget projects...
if not exist "%~dp0host\angular.json" (
    color 0C
    echo [ERROR] host directory or angular.json is missing!
    pause
    exit /b 1
)
if not exist "%~dp0chat-widget\angular.json" (
    color 0C
    echo [ERROR] chat-widget directory or angular.json is missing!
    pause
    exit /b 1
)
echo [OK] Both projects detected: Host Portal (4200) and Chat Widget (4203).
echo.

:: 3. Launch Chat Widget Server (Port 4203)
echo [3/4] Starting Standalone Chat Widget on Port 4203...
start "MFE Web Component: Chat Widget (Port 4203)" cmd /c "%~dp0start_widget.bat"
if %ERRORLEVEL% neq 0 (
    color 0C
    echo [WARNING] Failed to spawn chat-widget window!
) else (
    echo [OK] Chat Widget process launched in dedicated terminal.
)
timeout /t 3 /nobreak >nul
echo.

:: 4. Launch Host Portal (Port 4200)
echo [4/4] Starting Host Portal on Port 4200...
echo.
echo ------------------------------------------------------------------------------
echo  Active Endpoints:
echo    • Host Portal:         http://localhost:4200  (Angular 22 Host Shell)
echo    • Chat Widget Server:  http://localhost:4203  (Standalone Angular Elements)
echo    • Legacy HTML Demo:    external-legacy-portal.html (Plain HTML Embed)
echo.
echo  Closing this orchestrator window will NOT terminate the individual servers.
echo  To shut down, close each individual terminal window.
echo ------------------------------------------------------------------------------
echo.

start "MFE Pattern 3: Host Portal (Port 4200)" cmd /c "%~dp0start_host.bat"

echo Both servers have been initialized. Check each terminal window for build status.
pause
