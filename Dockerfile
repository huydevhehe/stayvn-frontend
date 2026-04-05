# Giai đoạn 1: Build mã nguồn React/Vite
FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Giai đoạn 2: Sử dụng Nginx để phục vụ các tệp tĩnh
FROM nginx:stable-alpine
# Copy tệp đã build từ Giai đoạn 1 vào thư mục của Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html
# Copy cấu hình Nginx tùy chỉnh cho SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Mở cổng 80 (cổng mặc định của Nginx)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
