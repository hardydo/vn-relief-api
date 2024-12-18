import { Router } from "express";

const RescueRequestsRouter = Router();

// 1. Danh sách yêu cầu cứu trợ theo type
RescueRequestsRouter.get('/:type');

// 2. Chi tiết yêu cầu cứu trợ
RescueRequestsRouter.get('/:id');

// 3. Tạo yêu cầu mới
RescueRequestsRouter.post('/');

// 4. Cập nhật yêu cầu (CHẶN khi đã có đội nhận)
RescueRequestsRouter.put('/:id');

// 5. Xóa yêu cầu (CHẶN khi đã có đội nhận)
RescueRequestsRouter.delete('/:id');

// 6. Xác minh yêu cầu cứu trợ (Role TNV xac_minh)
RescueRequestsRouter.put('/:id/verify');

// 7. Cập nhật trạng thái yêu cầu (Role đội cứu trợ)
RescueRequestsRouter.put('/:id/status');

// 8. Phân công yêu cầu cho đội cứu trợ (Role TNV xac_minh)
RescueRequestsRouter.post('/:id/team/:teamId/assign');

// 9. Danh sách hàng cứu trợ của 1 đơn cứu trợ
RescueRequestsRouter.get('/:id/items');

// 10. Cập nhật hàng cứu trợ (Ghi đè dữ liệu cũ)
RescueRequestsRouter.put('/:id/items/:itemId');

// 11. Lọc theo trạng thái
RescueRequestsRouter.get('/by-status/:status');

// 12. Lọc theo địa điểm
RescueRequestsRouter.get('/by-location/:location');

// 13. Yêu cầu gần đây (dựa vào vị trí người dùng)
RescueRequestsRouter.get('/nearby');

export default RescueRequestsRouter;
