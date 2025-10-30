# (Project I) Ứng dụng Web Quản lý Chung cư BlueMoon

> **Tác giả:** Vũ Quốc Anh
> **MSSV:** 20235011
> **Môn học:** Project I (Mã môn: IT3150 - Mã lớp: 755566)
> **GVHD:** Nguyễn Minh Huyền

---

> **LƯU Ý QUAN TRỌNG: TÀI LIỆU DỰ ÁN**
> 
> 🛑 Kho lưu trữ (Repository) này **chỉ chứa Mã nguồn (Source Code)** của ứng dụng.
> 
> 📄 Toàn bộ tài liệu báo cáo tuần (Báo cáo Tuần 1, 2, 3...), tài liệu thiết kế CSDL/API, và kế hoạch dự án được lưu trữ tập trung tại Google Drive:
> 
> ### ➡️ **[Toàn bộ Tài liệu Báo cáo Dự án (Google Drive)](https://drive.google.com/drive/folders/1uofLHhA_rHz-fn4r1MvG2Tbo2sXH7ATi)**

---

## 1. 📝 Mô tả Dự án

Dự án này xây dựng một ứng dụng Web (MERN Stack) nhằm giải quyết bài toán quản lý vận hành thủ công tại Chung cư BlueMoon. Ứng dụng cung cấp hai cổng giao tiếp:

1.  **Cổng Quản trị (Admin Portal):** Dành cho Ban Quản trị (BQT) để quản lý hộ khẩu, nhân khẩu, tính toán và theo dõi các khoản phí.
2.  **Cổng Cư dân (Resident Portal):** Dành cho cư dân để tra cứu thông báo phí và xem lịch sử thanh toán cá nhân.

## 2. 🛠️ Công nghệ Sử dụng (MERN Stack)

* **Frontend:** **React.js**
* **Backend:** **Node.js** & **Express.js** (Xây dựng RESTful API)
* **Database:** **MongoDB** (Sử dụng dịch vụ đám mây MongoDB Atlas)
* **Xác thực:** **JSON Web Tokens (JWT)**

## 3. 🎯 Tính năng Cốt lõi (Epics)

* **E-01: Quản lý Thu phí & Tài chính (Cho BQT):** Cấu hình phí, tạo phí hàng loạt, ghi nhận thanh toán, theo dõi công nợ.
* **E-02: Quản lý Cư dân (Cho BQT):** CRUD thông tin Hộ khẩu và Nhân khẩu (nhúng).
* **E-03: Báo cáo & Tra cứu (Cho BQT):** Thống kê dashboard, tìm kiếm, lọc dữ liệu.
* **E-04: Cổng thông tin Cư dân (Cho Cư dân):** Xem thông báo phí, tra cứu lịch sử đóng tiền.
* **E-05: Quản lý Hệ thống & Bảo mật (Chung):** Đăng ký, Đăng nhập (cho cả BQT & Cư dân), đổi mật khẩu.

## 4. 🗂️ Cấu trúc Kho lưu trữ (Monorepo)

Dự án được tổ chức theo cấu trúc monorepo đơn giản:

* `/backend/`: Chứa toàn bộ mã nguồn Backend (Node.js/Express, API, Models).
* `/frontend/`: Chứa toàn bộ mã nguồn Frontend (React, Components, Pages).
* `.gitignore`: (File .gitignore chuẩn của Node.js, bỏ qua `node_modules/`).
* `README.md`: (File này).

## 5. 🚀 Hướng dẫn Cài đặt và Chạy (Local)

Bạn cần chạy **song song 2 terminal** (một cho Backend, một cho Frontend).

### 5.1. Yêu cầu Môi trường

* [Node.js](https://nodejs.org/en) (Bản LTS)
* [Git](https://git-scm.com/)
* Tài khoản [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Miễn phí)
* [Postman](https://www.postman.com/) (Để kiểm thử API)

---

### 5.2. Cài đặt Backend (Server)

1.  Mở một terminal, di chuyển vào thư mục `backend`:
    ```bash
    cd backend
    ```
2.  Cài đặt các thư viện (dependencies) từ `package.json`:
    ```bash
    npm install
    ```
3.  **QUAN TRỌNG:** Tạo một file tên là `.env` trong thư mục `backend/` và điền các biến môi trường:
    ```text
    # Link kết nối CSDL MongoDB Atlas của bạn
    MONGO_URI=mongodb+srv://<username>:<password>@cluster...

    # Khóa bí mật JWT (bạn có thể tự bịa ra)
    JWT_SECRET=BLUEMOON_SECRET_KEY_123
    ```
4.  Khởi động server Backend:
    ```bash
    npm run dev 
    ```
    (Hoặc `npm start`, tùy thuộc vào file `package.json` của bạn)
    
    *(Server sẽ chạy tại cổng (port) bạn cấu hình trong code, ví dụ: http://localhost:5000)*

---

### 5.3. Cài đặt Frontend (Client)

1.  Mở một **terminal thứ hai**, di chuyển vào thư mục `frontend`:
    ```bash
    cd frontend
    ```
2.  Cài đặt các thư viện (dependencies):
    ```bash
    npm install
    ```
3.  (Tùy chọn) Bạn có thể cần tạo file `.env` trong thư mục `frontend/` để chỉ định địa chỉ API.
4.  Khởi động ứng dụng React:
    ```bash
    npm start
    ```
    (Hoặc `npm run dev` nếu dùng Vite)

    *(Ứng dụng web sẽ tự động mở trên trình duyệt, ví dụ: http://localhost:3000)*

---

### 5.4. Tài khoản Demo
*(Sẽ cập nhật sau khi hoàn thành...)*