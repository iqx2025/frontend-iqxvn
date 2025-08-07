# Footer Company Information Update

## Thay đổi đã thực hiện

### 1. Cập nhật thông tin công ty trong Footer

**File:** `src/components/layout/footer.tsx`

**Thay đổi:**
- Cập nhật tên công ty đầy đủ theo pháp lý
- Cập nhật địa chỉ trụ sở chính chính xác
- Cập nhật số điện thoại và email liên hệ
- Thêm thông tin tên công ty bằng tiếng Việt và tiếng nước ngoài
- Thêm tên viết tắt công ty

### 2. Thông tin công ty mới

#### Tên công ty:
- **Tiếng Việt:** CÔNG TY TNHH VIET NAM STOCK EXPRESS
- **Tiếng nước ngoài:** VIET NAM STOCK EXPRESS COMPANY LIMITED  
- **Tên viết tắt:** VNSE

#### Địa chỉ trụ sở chính:
P.702A Tầng 7, Tòa nhà Centre Point, 106 Nguyễn Văn Trỗi, Phường Phú Nhuận, Thành phố Hồ Chí Minh, Việt Nam

#### Thông tin liên hệ:
- **Điện thoại:** 1900 1509
- **Email:** contact@iqx.vn

### 3. Cập nhật Metadata

**File:** `src/app/layout.tsx`

**Thay đổi:**
- Cập nhật description để bao gồm tên công ty đầy đủ

### 4. Cập nhật Copyright

**Thay đổi:**
- Copyright từ "IQX - Vietnam Stock Express" thành "CÔNG TY TNHH VIET NAM STOCK EXPRESS"

## Kết quả

Footer hiện tại hiển thị:

```
Tên công ty:
  Tiếng Việt: CÔNG TY TNHH VIET NAM STOCK EXPRESS
  Tiếng nước ngoài: VIET NAM STOCK EXPRESS COMPANY LIMITED
  Tên viết tắt: VNSE

Địa chỉ trụ sở chính:
  📍 P.702A Tầng 7, Tòa nhà Centre Point, 106 Nguyễn Văn Trỗi, 
     Phường Phú Nhuận, Thành phố Hồ Chí Minh, Việt Nam

📞 1900 1509        ✉️ contact@iqx.vn

© 2025 CÔNG TY TNHH VIET NAM STOCK EXPRESS. Tất cả quyền được bảo lưu.
```

## Responsive Design

Footer được thiết kế responsive:
- Trên desktop: Thông tin liên hệ hiển thị trên 2 cột
- Trên mobile: Thông tin liên hệ hiển thị trên 1 cột
- Địa chỉ tự động wrap text phù hợp với màn hình

## Files đã thay đổi

1. ✅ `src/components/layout/footer.tsx` - Cập nhật thông tin công ty
2. ✅ `src/app/layout.tsx` - Cập nhật metadata description

## Testing

Đã kiểm tra:
- ✅ Footer hiển thị đúng thông tin công ty
- ✅ Responsive design hoạt động tốt
- ✅ Icons và styling không bị ảnh hưởng
- ✅ Copyright được cập nhật đúng
