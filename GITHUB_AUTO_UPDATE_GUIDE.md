# Hướng dẫn Auto-Update với GitHub

## ✅ Lỗi đã được sửa:
- Loại bỏ icon không hợp lệ khỏi cấu hình build
- Thêm author vào package.json
- Cấu hình build sẽ sử dụng icon mặc định của Electron

## 🔄 Cách Auto-Update hoạt động với GitHub:

### 1. **Quy trình cập nhật:**

**Khi bạn push code mới lên GitHub:**
1. Tạo **Release** mới trên GitHub với tag version (ví dụ: v1.0.1)
2. Upload file `.exe` mới vào Release
3. App trên máy người dùng sẽ tự động phát hiện và tải về

### 2. **Cấu hình GitHub Repository:**

**Bước 1: Tạo GitHub Repository**
```bash
# Tạo repo mới trên GitHub
# Tên: toolcrypt-csv-manager
# Public hoặc Private đều được
```

**Bước 2: Cập nhật cấu hình**
Sửa file `electron-builder.yml`:
```yaml
publish:
  provider: github
  owner: YOUR_GITHUB_USERNAME  # Thay đổi này
  repo: toolcrypt-csv-manager  # Tên repo của bạn

updater:
  provider: github
  owner: YOUR_GITHUB_USERNAME  # Thay đổi này
  repo: toolcrypt-csv-manager  # Tên repo của bạn
```

**Bước 3: Tạo GitHub Token**
1. Vào GitHub → Settings → Developer settings → Personal access tokens
2. Tạo token mới với quyền `repo`
3. Lưu token để sử dụng khi build

### 3. **Quy trình Release mới:**

**Khi có code mới:**

1. **Tăng version trong package.json:**
```json
{
  "version": "1.0.1"  // Tăng version
}
```

2. **Build và publish:**
```bash
# Build app
npm run build

# Publish lên GitHub (cần GitHub token)
electron-builder --publish=always
```

3. **Hoặc tạo Release thủ công:**
   - Vào GitHub → Releases → Create a new release
   - Tag: v1.0.1
   - Upload file: `ToolCrypt CSV Manager Setup 1.0.1.exe`

### 4. **App sẽ tự động cập nhật:**

**Trên máy người dùng:**
- App check update mỗi 1 tiếng
- Khi có version mới → hiển thị thông báo
- Tự động tải về và cài đặt
- Icon Debug Console xuất hiện khi có update

### 5. **Test Auto-Update:**

**Cách test:**
1. Build version 1.0.0
2. Tạo Release trên GitHub với version 1.0.1
3. Mở app → Settings → "Kiểm tra ngay"
4. App sẽ phát hiện version mới và tải về

### 6. **Cấu hình GitHub Actions (Tự động):**

Tạo file `.github/workflows/build.yml`:
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
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npx electron-builder --publish=always
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 7. **Lưu ý quan trọng:**

**✅ Có:**
- App sẽ tự động cập nhật khi có version mới
- Người dùng không cần tải lại app thủ công
- Có thể kiểm tra update thủ công trong Settings

**❌ Không có:**
- App KHÔNG tự động cập nhật code (chỉ cập nhật executable)
- Cần tạo Release trên GitHub để có update
- Cần cấu hình đúng GitHub repository

### 8. **Troubleshooting:**

**Nếu auto-update không hoạt động:**
1. Kiểm tra GitHub repository có đúng không
2. Kiểm tra Release có file .exe không
3. Kiểm tra version trong package.json
4. Xem logs trong Debug Console

**Debug auto-update:**
- Mở Settings → Debug Console
- Xem logs để biết lỗi gì
- Check network connection
