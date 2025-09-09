# ToolCrypt CSV Manager

Ứng dụng desktop hiện đại để quản lý và phân tích file CSV với focus vào dữ liệu giao dịch cryptocurrency.

## Tính năng chính

### 🗂️ Quản lý File CSV
- **Drag & Drop**: Kéo thả file CSV trực tiếp vào ứng dụng
- **Upload Multiple Files**: Chọn và upload nhiều file cùng lúc
- **Tag System**: Gắn tag cho file để dễ dàng phân loại
- **Download & Delete**: Tải về hoặc xóa file đã upload
- **File Information**: Hiển thị thông tin chi tiết (tên, kích thước, ngày upload)

### 🔍 Lọc & Phân tích Dữ liệu
- **Multi-file Analysis**: Chọn tối đa 10 file để phân tích cùng lúc
- **Wallet Detection**: Tự động phát hiện địa chỉ ví từ cột "From" và "To"
- **Duplicate Analysis**: Tìm ra các ví xuất hiện trong nhiều file
- **Transaction Count**: Đếm tổng số giao dịch của mỗi ví
- **Time Analysis**: Phân tích thời gian giao dịch sớm nhất và muộn nhất
- **File Mapping**: Hiển thị ví xuất hiện trong file nào và không xuất hiện trong file nào
- **Sorting**: Sắp xếp kết quả theo số giao dịch hoặc thời gian
- **External Links**: Liên kết trực tiếp đến Solscan và GMGN cho mỗi ví

### 🎨 Giao diện Hiện đại
- **Dark/Light Theme**: Chuyển đổi theme sáng/tối
- **Responsive Design**: Tương thích với nhiều kích thước màn hình
- **Smooth Animations**: Hiệu ứng chuyển động mượt mà
- **Collapsible Sidebar**: Thanh bên có thể thu gọn/mở rộng
- **Modern UI Components**: Sử dụng các component hiện đại với màu sắc dễ nhìn

## Cài đặt và Sử dụng

### Yêu cầu hệ thống
- Windows 10 trở lên
- Node.js 16+ (chỉ cần khi build từ source)

### Cài đặt từ file exe
1. Tải file `ToolCrypt CSV Manager Setup.exe` từ thư mục `build`
2. Chạy file cài đặt và làm theo hướng dẫn
3. Khởi động ứng dụng từ Start Menu hoặc Desktop

### Build từ source code

#### Bước 1: Cài đặt dependencies
```bash
npm install
```

#### Bước 2: Build ứng dụng
```bash
npm run build
```

#### Bước 3: Chạy ứng dụng (development)
```bash
npm run dev
```

#### Bước 4: Build file exe
```bash
npm run build-exe
```

Hoặc sử dụng script build tự động:
```bash
node build.js
```

## Cấu trúc dữ liệu CSV

Ứng dụng hỗ trợ file CSV với cấu trúc sau:

```csv
Signature,Block Time,Human Time,Action,From,To,Amount,Value,Decimals,Token Address,Multiplier
5ebSsJigph9JTWV7BaiHd2yzN9zmZBMETPcRyD48RoG6W5FiYLWH7Zq32rc3k6L6g9e2bq1hgr5v1nGqaFJe87hY,1757375827,2025-09-08T23:57:07.000Z,TRANSFER,ELqmSfVxTSkoGEdiH2TAbZUwMJYaxpdeJPaitFJqEyTA,5TRZYZXU8WnxG3R56Cz2j2DeE2CtWfzD2fYRvAUnSs8D,37915622276,0.2513,6,HLxdqSmiKamc4quBoMTxNVecTpJvzPRvrKg2HUJGEQcY,1.0
```

### Các cột quan trọng:
- **From**: Địa chỉ ví gửi
- **To**: Địa chỉ ví nhận  
- **Human Time**: Thời gian giao dịch (ISO format)
- **Action**: Loại giao dịch (TRANSFER, BURN, etc.)

## Công nghệ sử dụng

- **Electron**: Framework để tạo ứng dụng desktop
- **TypeScript**: Ngôn ngữ lập trình chính
- **SQLite**: Cơ sở dữ liệu local để lưu trữ thông tin file
- **PapaParse**: Library để parse CSV
- **CSS3**: Styling với CSS Variables và Animations
- **Font Awesome**: Icon library

## Cấu trúc thư mục

```
ToolCrypt/
├── src/
│   ├── main.ts              # Main process của Electron
│   ├── preload.ts           # Preload script
│   ├── database/
│   │   └── DatabaseManager.ts
│   ├── services/
│   │   └── CSVManager.ts
│   └── renderer/
│       ├── index.html
│       ├── styles.css
│       └── app.js
├── dist/                    # Compiled files
├── build/                   # Built executables
├── assets/                  # Icons and resources
├── package.json
├── tsconfig.json
├── build.js                 # Build script
└── README.md
```

## Hướng dẫn sử dụng

### Tab 1: Quản lý File
1. Kéo thả file CSV vào vùng drop zone hoặc click "Chọn File"
2. File sẽ được hiển thị trong danh sách với thông tin chi tiết
3. Click vào icon tag để thêm/sửa tag cho file
4. Sử dụng các nút hành động để tải về hoặc xóa file

### Tab 2: Lọc & Phân tích
1. Chọn tối đa 10 file từ danh sách (file đã upload ở Tab 1)
2. Click "Bắt đầu Phân tích" để xử lý dữ liệu
3. Xem kết quả trong bảng với các thông tin:
   - Địa chỉ ví
   - Tổng số giao dịch
   - File xuất hiện/không xuất hiện
   - Thời gian giao dịch sớm nhất/muộn nhất
   - Link đến Solscan và GMGN
4. Sử dụng dropdown để sắp xếp kết quả

## Lưu ý

- Dữ liệu được lưu trữ local trên máy tính của bạn
- File CSV được copy vào thư mục ứng dụng để đảm bảo tính toàn vẹn
- Ứng dụng tự động backup dữ liệu khi thực hiện các thao tác quan trọng

## Hỗ trợ

Nếu gặp vấn đề trong quá trình sử dụng, vui lòng:
1. Kiểm tra file CSV có đúng format không
2. Đảm bảo có đủ dung lượng ổ cứng
3. Khởi động lại ứng dụng nếu cần thiết

## Phiên bản

**v1.0.0** - Phiên bản đầu tiên với đầy đủ tính năng cơ bản
