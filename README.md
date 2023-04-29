# Dự án Kong Gateway kết nối các micro services

## Công nghệ sử dụng

- 📦 Container: Docker, Docker Compose
- 🛣 Gateway: Kong Getway
- 🛠 Backend: Fastify(Node.js)
- 🗃 Database: Postgres

## Khởi chạy dự án

Dự án đã được containerized vào trong docker nên việc setup các thành phần cơ bản là không cần thiết nếu bạn chỉ là nguời sử dụng, thỏa mãn điều kiện tiên quết là chúng ta sẽ chạy được dự án

### Điều kiện tiên quyết

- Docker đã được cài đặt
  - Nếu chưa cài đặt docker: mở [trang chủ của docker](https://www.docker.com/) và cài đặt phiên bản tương thích với hệ điều hành đang sử dụng
- file `.env` tồn tại ở thư mục gốc của dự án và cùng cấp với tập tin `docker-compose.yml`

### Khởi động container

Tại thư mục gốc của dự án, mở terminal và nhập lệnh để build và khởi chạy container:

```bash
docker compose up --build
```

### Cập nhật container

Để chắc chắn mỗi khi pull code mới nhất về và update thành công hay gỡ bỏ container bằng câu lệnh:

```bash
docker compose down
```

Sau đó mới tiến hành build lại:

```bash
docker compose up --build
```

### Xử trí khi gặp vấn đề về dữ liệu database

Nếu như bạn gặp phải trường hợp có vấn đề về dữ liệu database. Thì hãy reset database theo các bước sau:

- tắt docker-compose:
  ```bash
  docker compose down
  ```
- xóa volume của docker hiện giờ đi:
  ```bash
  docker volume rm kong-gateway-microservice_pgdata
  ```
- khởi chạy lại container:
  ```bash
  docker compose up --build
  ```

## Tài liệu các api

Hiện giờ dự án đang có hai services tích hợp vào gateway. Kong Gate way được thiết đặt theo hướng DBLESS nên là cổng 8001 sẽ chỉ có thể lấy được dữ liệu setting service và router chứ không thể gửi dữ liệu mới vào. Bạn muốn xem cài đặt thì hãy truy cập vào tệp tin `compose/kong/declarative/kong.yml` để biết thêm chi tiết nhé.

Danh sách các api đã viết tương ứng với từng service sẽ được liệt kê khi bạn truy cập vào hai địa chỉ sau(Sau khi khởi chạy docker):

- [Product Services API Documentation](http://localhost:8000/productServices/documentation/static/index.html#/)
- [User Services API Documentation](http://localhost:8000/userServices/documentation/static/index.html#/)
