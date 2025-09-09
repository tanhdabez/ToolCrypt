# Hướng dẫn Auto-Update với Code Ẩn

## 🔒 **Các cách giấu code nhưng vẫn check update được:**

### **Cách 1: Public Repository riêng cho Releases (Khuyến nghị)**

**Tạo 2 repositories:**
1. **Private repo:** `toolcrypt-csv-manager` (source code)
2. **Public repo:** `toolcrypt-csv-manager-releases` (chỉ releases)

**Ưu điểm:**
- Source code hoàn toàn private
- App có thể check update bình thường
- Không cần authentication
- Dễ maintain

**Cách setup:**
```yaml
# electron-builder.yml
publish:
  provider: github
  owner: YOUR_USERNAME
  repo: toolcrypt-csv-manager-releases  # Public repo

updater:
  provider: github
  owner: YOUR_USERNAME
  repo: toolcrypt-csv-manager-releases  # Public repo
```

### **Cách 2: GitHub Pages (Miễn phí)**

**Tạo branch `gh-pages` trong private repo:**
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

**Ưu điểm:**
- Source code private
- Releases public qua GitHub Pages
- Miễn phí
- Tự động sync

### **Cách 3: Custom Server (Linh hoạt nhất)**

**Tạo server riêng:**
```javascript
// server.js
const express = require('express');
const app = express();

app.get('/update/:platform/:version', (req, res) => {
  const { platform, version } = req.params;
  
  // Check if update available
  const latestVersion = '1.0.1';
  const hasUpdate = version !== latestVersion;
  
  if (hasUpdate) {
    res.json({
      version: latestVersion,
      url: `https://yourserver.com/downloads/app-${latestVersion}.exe`,
      notes: 'Bug fixes and improvements'
    });
  } else {
    res.json({ version: 'latest' });
  }
});

app.listen(3000);
```

**Cấu hình app:**
```yaml
# electron-builder.yml
publish:
  provider: generic
  url: https://yourserver.com/updates/

updater:
  provider: generic
  url: https://yourserver.com/updates/
```

### **Cách 4: Sử dụng GitHub Releases API (Nâng cao)**

**Tạo GitHub App:**
1. Vào GitHub → Settings → Developer settings → GitHub Apps
2. Tạo GitHub App mới
3. Cấp quyền read cho repository
4. Generate private key

**Cấu hình:**
```yaml
# electron-builder.yml
publish:
  provider: github
  owner: YOUR_USERNAME
  repo: YOUR_PRIVATE_REPO
  token: ${{ secrets.GITHUB_TOKEN }}

updater:
  provider: github
  owner: YOUR_USERNAME
  repo: YOUR_PRIVATE_REPO
  # Sử dụng GitHub App token
```

### **Cách 5: Sử dụng CDN/Cloud Storage**

**Upload releases lên:**
- AWS S3
- Google Cloud Storage
- Azure Blob Storage
- Cloudflare R2

**Cấu hình:**
```yaml
# electron-builder.yml
publish:
  provider: s3
  bucket: your-app-releases
  region: us-east-1

updater:
  provider: s3
  bucket: your-app-releases
  region: us-east-1
```

## 🎯 **Khuyến nghị cho bạn:**

### **Cách 1: Public Repository riêng (Dễ nhất)**

**Bước 1: Tạo public repo mới**
```bash
# Tên: toolcrypt-csv-manager-releases
# Public repository
# Chỉ chứa releases, không có source code
```

**Bước 2: Cập nhật cấu hình**
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

**Bước 3: Workflow**
1. Code trong private repo
2. Build app
3. Push releases lên public repo
4. App check update từ public repo

### **Cách 2: GitHub Pages (Miễn phí)**

**Bước 1: Tạo branch gh-pages**
```bash
git checkout --orphan gh-pages
git rm -rf .
echo "# Releases" > README.md
git add README.md
git commit -m "Initial gh-pages"
git push origin gh-pages
```

**Bước 2: Enable GitHub Pages**
- Vào repo → Settings → Pages
- Source: Deploy from a branch
- Branch: gh-pages

**Bước 3: Cập nhật cấu hình**
```yaml
# electron-builder.yml
publish:
  provider: github
  owner: YOUR_USERNAME
  repo: YOUR_PRIVATE_REPO
  # Sử dụng GitHub Pages
```

## 🔧 **Setup chi tiết (Cách 1 - Khuyến nghị):**

### **Tạo Public Repository cho Releases:**

1. **Vào GitHub → New repository**
2. **Tên:** `toolcrypt-csv-manager-releases`
3. **Public repository**
4. **Không tạo README, .gitignore, license**

### **Cập nhật cấu hình:**

```yaml
# electron-builder.yml
appId: com.toolcrypt.csvmanager
productName: ToolCrypt CSV Manager
directories:
  output: build
files:
  - dist/**/*
  - src/renderer/**/*
  - node_modules/**/*
  - package.json

win:
  target: nsis
  publisherName: ToolCrypt

nsis:
  oneClick: false
  allowToChangeInstallationDirectory: true
  createDesktopShortcut: true
  createStartMenuShortcut: true
  displayLanguageSelector: false
  language: 1033

publish:
  provider: github
  owner: YOUR_USERNAME
  repo: toolcrypt-csv-manager-releases

updater:
  provider: github
  owner: YOUR_USERNAME
  repo: toolcrypt-csv-manager-releases
```

### **Workflow:**

1. **Code trong private repo**
2. **Build app:**
   ```bash
   npm run build
   electron-builder --config electron-builder.yml
   ```
3. **Upload file .exe lên public repo releases**
4. **App sẽ check update từ public repo**

## ✅ **Kết quả:**

- **Source code:** Hoàn toàn private
- **Releases:** Public, app có thể check update
- **Bảo mật:** Cao
- **Đơn giản:** Dễ setup và maintain
- **Miễn phí:** Không tốn chi phí

**Bạn muốn thử cách nào? Tôi khuyến nghị Cách 1 vì đơn giản và hiệu quả nhất!**
