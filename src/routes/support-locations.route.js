import { Router } from "express";

const SupportLocationsRouter = Router();

// 1. Danh sách địa điểm
SupportLocationsRouter.get('/');

// 2. Chi tiết địa điểm và hàng hóa tại địa điểm đó
SupportLocationsRouter.get('/:id');

// 3. Thêm địa điểm mới
SupportLocationsRouter.post('/');

// 4. Cập nhật thông tin địa điểm
SupportLocationsRouter.put('/:id');

// 5. Xóa địa điểm
SupportLocationsRouter.delete('/:id');

// 6. Lọc địa điểm theo loại
SupportLocationsRouter.get('/by-type/:type');

// 7. Nhận hàng tại địa điểm hỗ trợ
SupportLocationsRouter.post('/receive');

// 8. Phát hàng tại địa điểm hỗ trợ
SupportLocationsRouter.post('/:id/rescue-requests/:rescueRequestId/distribute');

// 9. Tìm địa điểm hỗ trợ gần nhất
SupportLocationsRouter.get('/nearby/:coordinates');

export default SupportLocationsRouter;
