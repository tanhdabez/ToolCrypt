@echo off
echo ToolCrypt CSV Manager - Starting...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

REM Check if dist folder exists
if not exist "dist" (
    echo Building TypeScript files...
    npm run build
    echo.
)

echo Starting application...
npm run dev

pause
