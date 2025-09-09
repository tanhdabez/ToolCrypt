@echo off
echo Testing Settings Tab with Manual Update Check...
echo.

echo Step 1: Building app with Settings tab...
call build.bat
if %errorlevel% neq 0 (
    echo Error: Build failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Starting app to test Settings tab...
echo Features to test:
echo 1. Settings tab in sidebar
echo 2. Manual check for updates button
echo 3. Update status display
echo 4. Debug console toggle
echo 5. App info display
echo.

cd build\win-unpacked
start "" "ToolCrypt CSV Manager.exe"

echo.
echo App started! Test the following:
echo 1. Click on Settings tab in sidebar
echo 2. Click "Kiểm tra ngay" button to manually check updates
echo 3. Check update status display
echo 4. Click "Mở Debug Console" to toggle debug panel
echo 5. Verify app info is displayed correctly
echo.
pause
