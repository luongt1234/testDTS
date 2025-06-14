# Node.js Express API

Đây là một dự án API đơn giản sử dụng Node.js, Express, MongoDB và Mongoose.

## 🚀 Tính năng

- Đăng ký, đăng nhập người dùng
- Xác thực người dùng bằng JWT
- Phân quyền người dùng (admin, user)
- Soft delete người dùng
- Middleware bảo vệ route

## 📁 Cấu trúc thư mục

src/
│
├── controllers/ # Xử lý logic API
├── models/ # Định nghĩa mongoose schemas
├── routers/ # Định tuyến API
├── middleware/ # Middleware xác thực & phân quyền
├── lib/ # Tiện ích (utils, token, hash,...)
└── server.js # Điểm khởi chạy ứng dụng

## Công nghệ sử dụng
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT (JSON Web Token)
- Bcrypt (mã hóa mật khẩu)
- dotenv (biến môi trường)

## Cách để chạy được bài làm
(Thay đổi MONGODB_URL trong file .env thành URL đã được ghi ở trong mail hoặc URL mongodb bất kì)
- git clone https://github.com/luongt1234/testDTS.git
- npm init
- npm i express bcrypt cookie-parser cookies cors dotenv jsonwebtoken mongoose nodemon
- npm start
