# 🧾 Bite Bill — Smart Bill Splitting & Payments

> Quản lý hóa đơn & thanh toán nhóm chưa bao giờ dễ hơn.  
> Được xây dựng với công nghệ hiện đại, tối ưu cho trải nghiệm người dùng và tốc độ phát triển.

---

## 🚀 Stack công nghệ

| Công nghệ      | Mô tả |
|----------------|-------|
| [Next.js 15](https://nextjs.org/) | React Framework tối ưu hiệu suất, hỗ trợ app directory & RSC |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework hiện đại, responsive, tối ưu build |
| [shadcn/ui](https://ui.shadcn.dev/) | Hệ thống UI component mạnh mẽ & đẹp mắt, kết hợp tốt với Tailwind |
| [Better Auth](https://github.com/nextauthjs/better-auth) | Giải pháp xác thực hiện đại, thay thế `next-auth` |
| [Prisma ORM](https://www.prisma.io/) | ORM hiện đại với type-safety tuyệt vời |
| [PostgreSQL](https://www.postgresql.org/) | Hệ quản trị cơ sở dữ liệu quan hệ mã nguồn mở mạnh mẽ |

---

## ✨ Tính năng chính

- ✅ Quản lý & chia hóa đơn theo nhóm
- ✅ Xác thực người dùng hiện đại (OAuth, email, OTP...)
- ✅ Giao diện mobile-first đẹp mắt
- ✅ API REST/GraphQL (tùy cấu hình)
- ✅ Kiến trúc linh hoạt, dễ mở rộng (micro-frontend friendly)
- ✅ Hệ thống caching & logging theo chuẩn production

---

## 🛠️ Cài đặt

\`\`\`bash
# 1. Clone source
git clone https://github.com/hoan02/bite-bill.git
cd bite-bill

# 2. Cài dependencies
npm i --legacy-peer-deps

# 3. Cấu hình biến môi trường
cp .env.example .env
# Sau đó cập nhật thông tin DB, Auth v.v.

# 4. Khởi tạo database (PostgreSQL)
npx prisma db push

# 5. Chạy dev
npm run dev
\`\`\`

---

## 🧩 Kiến trúc & Thư mục

\`\`\`
bite-bill/
├── app/              # App directory (Next.js 15)
│   └── (auth)/       # Better-auth routes
├── lib/              # Helpers & wrapper utilities
├── prisma/           # Schema, seed scripts
├── components/       # UI components (shadcn)
├── styles/           # Tailwind configs
├── public/           # Assets
├── .env              # Biến môi trường
\`\`\`

---

## 📸 Screenshots

> (Thêm hình ảnh UI thực tế của app, nếu có)

---

## 🔒 Bảo mật

Ứng dụng tuân thủ các nguyên tắc bảo mật tốt như:
- CSRF protection
- Secure cookies & session
- Role-based access control (RBAC)
- HTTPS (trong production)

---

## 📢 Đóng góp

Bạn có thể góp ý, mở pull request hoặc mở issue tại [GitHub repository](https://github.com/hoan02/bite-bill).

---

## 📄 License

MIT License © 2025 Bite Bill Team