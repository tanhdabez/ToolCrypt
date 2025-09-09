# Hướng dẫn Auto-Update cho ToolCrypt CSV Manager

## Tính năng Auto-Update đã được tích hợp

### ✅ Các tính năng đã hoàn thành:

1. **Timer Check Update**: App sẽ tự động check update sau mỗi 1 tiếng
2. **Icon Debug Console**: Chỉ hiển thị khi có update mới
3. **Auto-download**: Tự động tải update khi có
4. **Install prompt**: Thông báo khi update sẵn sàng cài đặt
5. **Settings Tab**: Tab cài đặt với check update thủ công
6. **Manual Update Check**: Người dùng có thể check update bất cứ lúc nào

### 🔧 Cách hoạt động:

1. **Khi mở app**: 
   - App sẽ check update ngay lập tức
   - Icon Debug Console sẽ ẩn nếu không có update

2. **Sau 1 tiếng**:
   - App tự động check update
   - Nếu có update mới, icon Debug Console sẽ xuất hiện
   - Thông báo update sẽ hiện trong sidebar

3. **Khi có update**:
   - Icon Debug Console hiển thị
   - Thông báo "Update Available" trong sidebar
   - Tự động download update
   - Hiển thị progress download
   - Nút "Install" xuất hiện khi download xong

4. **Tab Settings**:
   - Kiểm tra update thủ công bất cứ lúc nào
   - Xem trạng thái cập nhật chi tiết
   - Thông tin phiên bản hiện tại
   - Lịch sử kiểm tra cập nhật
   - Toggle Debug Console

### 🚀 Cách build app với auto-update:

```bash
# Sử dụng script build mới
build.bat

# Hoặc build thủ công
npm run build
electron-builder --config electron-builder.yml
```

### 📁 Files đã được cập nhật:

- `src/main.ts`: Timer check update từ 30 phút → 1 tiếng
- `src/renderer/index.html`: Ẩn icon Debug Console mặc định
- `src/renderer/app.js`: Hiển thị icon khi có update
- `package.json`: Cấu hình build với icon và publisher
- `electron-builder.yml`: File cấu hình build riêng
- `build.bat`: Script build với auto-update support
- `test-update.bat`: Script test auto-update

### 🔄 Quy trình cập nhật app exe:

1. **Thay đổi code** trong `src/`
2. **Tăng version** trong `package.json`
3. **Build app**:
   ```bash
   build.bat
   ```
4. **File exe mới** sẽ được tạo trong `build/`

### 📝 Lưu ý quan trọng:

- Icon Debug Console chỉ hiển thị khi có update
- App check update mỗi 1 tiếng một lần
- Cần cấu hình GitHub repository để auto-update hoạt động
- Thay đổi `your-username` và `toolcrypt-csv-manager` trong `electron-builder.yml`

### 🧪 Test auto-update:

```bash
# Test auto-update cơ bản
test-update.bat

# Test Settings tab với manual update check
test-settings.bat
```

**test-update.bat** sẽ:
- Build app
- Mở app để test
- Kiểm tra icon Debug Console ẩn/hiện
- Monitor update checking

**test-settings.bat** sẽ:
- Build app với Settings tab
- Mở app để test Settings
- Kiểm tra nút check update thủ công
- Test Debug Console toggle
- Verify app info display
