# Matrix Destiny Analyzer

Website phân tích Matrix Destiny (Ma trận vận mệnh) cá nhân hóa, miễn phí và không cần đăng nhập.

## Cài Đặt Khởi Chạy Local

Bạn cần có Node.js trên máy:

```bash
# Cài đặt
npm install

# Khởi chạy dev server
npm run dev
```

Cần tạo file `.env.local` ở thư mục gốc chứa key Gemini API (miễn phí):
`GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here`

## Hướng Dẫn Deploy Miễn Phí Trên Vercel 🚀

Vì yêu cầu website "không mất phí" và "triển khai trên Vercel", bạn chỉ cần làm các bước sau để đưa nó lên mạng:

1. Đẩy code này lên một **GitHub Repository** của bạn (chế độ Public hoặc Private đều được).
2. Đăng nhập vào [Vercel](https://vercel.com/) bằng tài khoản GitHub.
3. Nhấp vào **"Add New Project"** và import repository bạn vừa tạo.
4. Ở phần **Environment Variables** cấu hình biến:
   - Key: `GOOGLE_GENERATIVE_AI_API_KEY`
   - Value: [Lấy API key Gemini của bạn tại Google AI Studio](https://aistudio.google.com/app/apikey) (Miễn phí hoàn toàn).
5. Nhấp **Deploy** và chờ 1 phút. Xong! 🎉

Giao diện sẽ tự động thích ứng với cấu hình màn hình và chế độ Sáng/Tối. Người dùng chỉ cần nhập ngày sinh, AI sẽ sinh ra bản báo cáo Destiny Matrix 10.000 chữ siêu chi tiết (sử dụng model `gemini-2.5-pro` hỗ trợ logic cực tốt và viết dài).
