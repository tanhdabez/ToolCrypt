@echo off
echo Testing Auto-Update Functionality...
echo.

echo Step 1: Building current version...
call build.bat
if %errorlevel% neq 0 (
    echo Error: Build failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Starting app to test auto-update...
echo The app will check for updates every 1 hour.
echo Debug Console icon will only appear when an update is available.
echo.

cd build\win-unpacked
start "" "ToolCrypt CSV Manager.exe"

echo.
echo App started! Check the following:
echo 1. Debug Console icon should be hidden initially
echo 2. App will check for updates every 1 hour
echo 3. When update is available, Debug Console icon will appear
echo 4. Update notification will show in sidebar
echo.
pause
