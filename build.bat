@echo off
echo Building ToolCrypt CSV Manager with Auto-Update...
echo.

echo Step 1: Compiling TypeScript...
call npm run build
if %errorlevel% neq 0 (
    echo Error: TypeScript compilation failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Building executable with auto-update support...
call electron-builder --config electron-builder.yml
if %errorlevel% neq 0 (
    echo Error: Executable build failed!
    pause
    exit /b 1
)

echo.
echo Build completed successfully!
echo Executable location: build\ToolCrypt CSV Manager Setup 1.0.0.exe
echo.
echo Auto-update features:
echo - Check for updates every 1 hour
echo - Debug Console icon only shows when update is available
echo - Automatic download and install prompts
pause
