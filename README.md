# Sủi Xanh - Nền Tảng Bán Hàng & Truyền Thông Sản Phẩm Sinh Học

> **Sủi Xanh (Eco Fizz Tablet)** là dự án khởi nghiệp phát triển viên nén khử mùi và hỗ trợ làm sạch bồn cầu/cống thoát nước tận dụng phụ phẩm vỏ cam từ các cửa hàng nước ép và cơ sở chế biến thực phẩm. 

---

## Điểm Nổi Bật Của Website

- **Giao diện bán hàng trực quan (E-Commerce Storefront):**
  - Trưng bày các gói sản phẩm: Combo Khởi Động (Hộp treo + 3 viên sủi), Hộp Refill 6 viên, Combo Gia Đình Xanh, Gói Dùng Thử.
  - Khung placeholder chuẩn hóa sẵn sàng để tải ảnh sản phẩm chụp thực tế.
- **Phòng Thí Nghiệm Sủi Bọt Ảo (Interactive Fizz Lab):**
  - Mô phỏng tương tác phản ứng sủi bọt khí $CO_2$ cuốn trôi cặn bám, giải phóng hoạt chất $D\text{-Limonene}$ tự nhiên.
  - Đo lường chỉ số $pH$ trung tính 6.8 an toàn men sứ và hiệu quả khử mùi hôi.
- **Bộ Tính Toán Giảm Rác Thải & Tiết Kiệm (Eco Calculator):**
  - Thanh trượt tính toán theo quy mô gia đình: số kg vỏ cam tái chế/năm, số chai nhựa hóa chất giảm bớt, chi phí tiết kiệm.
- **Quy Trình 5 Bước Kinh Tế Tuần Hoàn (Circular Economy):**
  - Giới thiệu quy trình khép kín từ thu gom vỏ cam tươi đến thành phẩm gia dụng xanh.
- **Kênh Truyền Thông & Nhận Diện:**
  - Mockup Fanpage Facebook và kênh video ngắn TikTok của dự án.
- **Giỏ Hàng & Đặt Hàng Nhanh:**
  - Giỏ hàng trượt (Cart Drawer) hỗ trợ mã giảm giá `SUIXANH10`, tính toán phí vận chuyển.
  - Modal thanh toán nhanh hỗ trợ COD (khi nhận hàng) và quét mã VietQR/MoMo.

---

## Công Nghệ Sử Dụng

- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS v4, Plus Jakarta Sans
- **Icons:** Lucide React
- **Build Tool:** Vite 6
- **Server:** Express / Node.js

---

## Hướng Dẫn Cài Đặt & Chạy Cục Bộ (Local)

1. **Clone repository về máy:**
   ```bash
   git clone https://github.com/<tai-khoan-cua-ban>/sui-xanh-website.git
   cd sui-xanh-website
   ```

2. **Cài đặt thư viện dependencies:**
   ```bash
   npm install
   ```

3. **Chạy máy chủ phát triển (Development Server):**
   ```bash
   npm run dev
   ```
   Mở trình duyệt tại: `http://localhost:3000`

4. **Đóng gói dự án (Build for Production):**
   ```bash
   npm run build
   ```

---

## Hướng Dẫn Đưa Lên GitHub (Step-by-Step)

Nếu bạn chưa có repository trên GitHub, thực hiện theo các bước sau:

1. Đăng nhập vào [GitHub](https://github.com) và bấm nút **"New repository"**.
2. Đặt tên repository (ví dụ: `sui-xanh-website`), chọn chế độ **Public** hoặc **Private**, rồi bấm **Create repository**.
3. Mở Terminal tại thư mục dự án và chạy các lệnh sau:
   ```bash
   git init
   git add .
   git commit -m "feat: Khởi tạo website bán hàng & truyền thông Sủi Xanh"
   git branch -M main
   git remote add origin https://github.com/<tai-khoan-cua-ban>/sui-xanh-website.git
   git push -u origin main
   ```

---

## Bản Quyền
© 2026 Dự án Khởi Nghiệp Sủi Xanh (Eco Fizz Vietnam).
