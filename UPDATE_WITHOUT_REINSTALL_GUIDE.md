# Hướng dẫn Update Code mới vào EXE không cần gỡ cài lại

## ✅ **CÓ! Bạn có thể update code mới mà không cần gỡ cài lại!**

### **Cách hoạt động:**
1. **Bạn code mới** → Build → Tạo Release mới
2. **App tự động phát hiện** có version mới
3. **App tự động tải về** và cài đặt
4. **Người dùng không cần gỡ cài lại**

## 🔄 **Quy trình Update Code mới:**

### **Bước 1: Code mới**
```bash
# Thay đổi code trong src/
# Ví dụ: thêm tính năng mới, sửa bug, etc.
```

### **Bước 2: Tăng version**
```json
// package.json
{
  "version": "1.0.1"  // Tăng từ 1.0.0 lên 1.0.1
}
```

### **Bước 3: Build app mới**
```bash
npm run build
electron-builder --config electron-builder.yml
```

### **Bước 4: Tạo Release mới trên GitHub**
1. **Vào GitHub → Releases → Create a new release**
2. **Tag version:** `v1.0.1`
3. **Upload file:** `ToolCrypt CSV Manager Setup 1.0.1.exe`
4. **Publish release**

### **Bước 5: App tự động update**
- **App trên máy người dùng** sẽ tự động phát hiện version mới
- **Tự động tải về** và cài đặt
- **Không cần gỡ cài lại**

## 🎯 **Các loại Update:**

### **1. Update Code (Source Code)**
- **Thay đổi:** Logic, tính năng, UI, etc.
- **Cách:** Build lại → Tạo Release mới
- **Kết quả:** App tự động update

### **2. Update Dependencies**
- **Thay đổi:** npm packages, libraries
- **Cách:** `npm install` → Build lại → Release
- **Kết quả:** App tự động update

### **3. Update Configuration**
- **Thay đổi:** Settings, config files
- **Cách:** Sửa config → Build lại → Release
- **Kết quả:** App tự động update

## 🔧 **Setup Auto-Update:**

### **Cấu hình GitHub Repository:**
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

### **App sẽ tự động:**
- Check update mỗi 1 tiếng
- Phát hiện version mới
- Tải về và cài đặt
- Không cần user can thiệp

## 📱 **Trải nghiệm người dùng:**

### **Khi có update:**
1. **Thông báo:** "Có cập nhật mới"
2. **Icon Debug Console** xuất hiện
3. **Tự động tải về** (có thể thấy progress)
4. **Tự động cài đặt** khi tải xong
5. **App restart** với version mới

### **Người dùng có thể:**
- **Check update thủ công** trong Settings
- **Xem thông tin update** (version, size, etc.)
- **Chọn cài đặt ngay** hoặc sau
- **Xem logs** trong Debug Console

## 🚀 **Workflow hoàn chỉnh:**

### **Cho Developer (Bạn):**
```bash
# 1. Code mới
git add .
git commit -m "Add new feature"

# 2. Tăng version
# Sửa package.json: "version": "1.0.1"

# 3. Build
npm run build
electron-builder --config electron-builder.yml

# 4. Tạo Release
# Upload file .exe lên GitHub Releases

# 5. Done! App sẽ tự động update
```

### **Cho End User:**
- **Không cần làm gì**
- **App tự động update**
- **Không cần gỡ cài lại**
- **Không mất data**

## 🔍 **Test Auto-Update:**

### **Cách test:**
1. **Build version 1.0.0**
2. **Cài đặt app**
3. **Tạo Release 1.0.1** trên GitHub
4. **Mở app → Settings → "Kiểm tra ngay"**
5. **App sẽ phát hiện update và tải về**

### **Debug:**
- **Mở Debug Console** để xem logs
- **Check network connection**
- **Verify GitHub repository**

## ⚠️ **Lưu ý quan trọng:**

### **Cần có:**
- **GitHub repository** (public hoặc public releases)
- **Releases** với file .exe
- **Version khác nhau** trong package.json

### **Không cần:**
- **Gỡ cài lại** app
- **Mất data** người dùng
- **User can thiệp** (tự động)

### **Tự động:**
- **Check update** mỗi 1 tiếng
- **Tải về** khi có version mới
- **Cài đặt** khi tải xong
- **Restart** với version mới

## ✅ **Kết luận:**

**CÓ! Bạn có thể update code mới vào file exe mà không cần gỡ cài lại!**

- **Code mới** → Build → Release → **App tự động update**
- **Người dùng** không cần làm gì
- **Không mất data** hoặc settings
- **Tự động** và **liền mạch**

**Đây chính là sức mạnh của auto-update system!** 🚀
