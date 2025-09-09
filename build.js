const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building ToolCrypt CSV Manager...');

try {
  // Step 1: Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Step 2: Compile TypeScript
  console.log('🔨 Compiling TypeScript...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Step 3: Create assets directory if it doesn't exist
  const assetsDir = path.join(__dirname, 'assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir);
  }
  
  // Step 4: Create a simple icon (you can replace this with a real icon)
  console.log('🎨 Creating icon...');
  const iconPath = path.join(assetsDir, 'icon.ico');
  if (!fs.existsSync(iconPath)) {
    // Create a placeholder icon file
    fs.writeFileSync(iconPath, ''); // You should replace this with a real .ico file
    console.log('⚠️  Please replace assets/icon.ico with a real icon file');
  }
  
  // Step 5: Build executable
  console.log('📦 Building executable...');
  execSync('npm run build-exe', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
  console.log('📁 Executable files are in the "build" directory');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
