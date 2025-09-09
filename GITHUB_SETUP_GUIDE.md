# Hướng dẫn Setup GitHub Repository và Releases

## 🔧 **Sửa lỗi 404 - Cấu hình GitHub Repository**

### **Bước 1: Lấy thông tin GitHub Repository**

1. **Vào repository của bạn trên GitHub**
2. **Copy URL repository** (ví dụ: `https://github.com/username/toolcrypt-csv-manager`)
3. **Lấy thông tin:**
   - `YOUR_GITHUB_USERNAME` = `username`
   - `YOUR_REPO_NAME` = `toolcrypt-csv-manager`

### **Bước 2: Cập nhật cấu hình**

**Sửa file `electron-builder.yml`:**
```yaml
publish:
  provider: github
  owner: YOUR_GITHUB_USERNAME  # Thay bằng username thật
  repo: YOUR_REPO_NAME        # Thay bằng tên repo thật

updater:
  provider: github
  owner: YOUR_GITHUB_USERNAME  # Thay bằng username thật
  repo: YOUR_REPO_NAME        # Thay bằng tên repo thật
```

**Ví dụ:**
```yaml
publish:
  provider: github
  owner: admin123
  repo: toolcrypt-csv-manager

updater:
  provider: github
  owner: admin123
  repo: toolcrypt-csv-manager
```

## 📦 **Tạo Release trên GitHub**

### **Cách 1: Tạo Release thủ công**

1. **Vào GitHub Repository**
2. **Click "Releases"** (bên phải)
3. **Click "Create a new release"**
4. **Điền thông tin:**
   - **Tag version:** `v1.0.0` (bắt đầu với v)
   - **Release title:** `ToolCrypt CSV Manager v1.0.0`
   - **Description:** Mô tả về phiên bản mới
5. **Upload file:**
   - Kéo thả file `ToolCrypt CSV Manager Setup 1.0.0.exe` vào phần "Attach binaries"
6. **Click "Publish release"**

### **Cách 2: Tự động tạo Release (Khuyến nghị)**

**Tạo file `.github/workflows/build.yml`:**
```yaml
name: Build and Release
on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npx electron-builder --publish=always
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Cách sử dụng:**
```bash
# Tăng version
# Sửa package.json: "version": "1.0.1"

# Tạo tag và push
git add .
git commit -m "Release v1.0.1"
git tag v1.0.1
git push origin main
git push origin v1.0.1
```

## 🎨 **Đổi tên App và Logo**

### **Đổi tên App:**

**Sửa file `package.json`:**
```json
{
  "name": "your-app-name",
  "productName": "Your App Name",
  "description": "Your app description"
}
```

**Sửa file `electron-builder.yml`:**
```yaml
appId: com.yourcompany.yourapp
productName: Your App Name
```

### **Thêm Logo/Icon:**

1. **Tạo file icon:**
   - Tạo file `assets/icon.ico` (Windows)
   - Kích thước: 256x256px hoặc 512x512px
   - Format: .ico cho Windows

2. **Cập nhật cấu hình:**
```yaml
# electron-builder.yml
win:
  target: nsis
  icon: assets/icon.ico

nsis:
  installerIcon: assets/icon.ico
  uninstallerIcon: assets/icon.ico
```

3. **Rebuild app:**
```bash
npm run build
electron-builder --config electron-builder.yml
```

## 🚀 **Test Auto-Update**

### **Sau khi setup xong:**

1. **Build và tạo Release đầu tiên:**
```bash
npm run build
electron-builder --config electron-builder.yml
```

2. **Upload file .exe lên GitHub Release**

3. **Test app:**
   - Mở app
   - Vào Settings → "Kiểm tra ngay"
   - App sẽ tìm thấy repository và check update

### **Tạo update mới:**

1. **Tăng version:**
```json
// package.json
"version": "1.0.1"
```

2. **Build và tạo Release mới:**
```bash
npm run build
electron-builder --config electron-builder.yml
```

3. **Upload lên GitHub Release v1.0.1**

4. **App sẽ tự động phát hiện update!**

## 🔍 **Troubleshooting**

### **Nếu vẫn lỗi 404:**
1. Kiểm tra repository có tồn tại không
2. Kiểm tra repository có public không
3. Kiểm tra tên repository có đúng không
4. Kiểm tra có Release nào không

### **Nếu auto-update không hoạt động:**
1. Kiểm tra GitHub token
2. Kiểm tra repository permissions
3. Xem logs trong Debug Console

### **Debug:**
- Mở Settings → Debug Console
- Xem logs để biết lỗi gì
- Check network connection
