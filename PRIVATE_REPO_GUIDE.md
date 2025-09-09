# Hướng dẫn Auto-Update với Private Repository

## ⚠️ **Vấn đề với Private Repository:**

Khi repository private, app trên máy người dùng sẽ **KHÔNG THỂ** truy cập để check update vì:
- Cần authentication (GitHub token)
- Token không thể embed trong app (bảo mật)
- Người dùng không có quyền truy cập

## 🔧 **Giải pháp:**

### **Cách 1: Chuyển sang Public Repository (Khuyến nghị)**

**Lý do:**
- App có thể check update mà không cần authentication
- Đơn giản, dễ setup
- Người dùng có thể xem source code (nếu muốn)

**Cách làm:**
1. Vào GitHub repository
2. Settings → General → Danger Zone
3. Click "Change repository visibility"
4. Chọn "Make public"

### **Cách 2: Tạo Public Repository riêng cho Releases**

**Tạo 2 repositories:**
1. **Private repo:** Chứa source code
2. **Public repo:** Chỉ chứa releases

**Cấu hình:**
```yaml
# electron-builder.yml
publish:
  provider: github
  owner: YOUR_USERNAME
  repo: your-app-releases  # Public repo cho releases

updater:
  provider: github
  owner: YOUR_USERNAME
  repo: your-app-releases  # Public repo cho releases
```

**Workflow:**
1. Code trong private repo
2. Build và push releases lên public repo
3. App check update từ public repo

### **Cách 3: Sử dụng GitHub Pages (Nâng cao)**

**Tạo file `gh-pages` branch:**
```bash
# Tạo branch gh-pages
git checkout --orphan gh-pages
git rm -rf .
echo "# Releases" > README.md
git add README.md
git commit -m "Initial gh-pages"
git push origin gh-pages
```

**Cấu hình:**
```yaml
# electron-builder.yml
publish:
  provider: github
  owner: YOUR_USERNAME
  repo: YOUR_PRIVATE_REPO
  # Sử dụng GitHub Pages
```

### **Cách 4: Sử dụng Custom Server (Phức tạp nhất)**

**Tạo server riêng:**
- Host file update trên server riêng
- App check update từ server
- Cần maintain server

## 🎯 **Khuyến nghị:**

### **Cho dự án cá nhân:**
- **Chuyển sang public repository**
- Đơn giản, hiệu quả
- Người dùng có thể xem source code

### **Cho dự án thương mại:**
- **Tạo public repository riêng cho releases**
- Giữ source code private
- Chỉ public releases

### **Cho dự án enterprise:**
- **Sử dụng custom server**
- Kiểm soát hoàn toàn
- Cần maintain server

## 🔄 **Cách thực hiện (Khuyến nghị):**

### **Bước 1: Tạo Public Repository cho Releases**

```bash
# Tạo repo mới trên GitHub
# Tên: toolcrypt-csv-manager-releases
# Public repository
```

### **Bước 2: Cập nhật cấu hình**

```yaml
# electron-builder.yml
publish:
  provider: github
  owner: YOUR_USERNAME
  repo: toolcrypt-csv-manager-releases

updater:
  provider: github
  owner: YOUR_USERNAME
  repo: toolcrypt-csv-manager-releases
```

### **Bước 3: Workflow**

1. **Code trong private repo**
2. **Build app:**
   ```bash
   npm run build
   electron-builder --config electron-builder.yml
   ```
3. **Push release lên public repo**
4. **App sẽ check update từ public repo**

## 📝 **Lưu ý quan trọng:**

- **Private repo:** App KHÔNG THỂ check update
- **Public repo:** App có thể check update bình thường
- **Hybrid approach:** Tốt nhất cho dự án thương mại
- **Custom server:** Phức tạp nhưng linh hoạt nhất
