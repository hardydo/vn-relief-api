import { Router } from "express";

const TransportSchedulesRouter = Router();

// Lấy danh sách lịch trình vận chuyển
TransportSchedulesRouter.get('/');

// Lấy chi tiết lịch trình vận chuyển
TransportSchedulesRouter.get('/:id');

// Cập nhật thông tin lịch trình
TransportSchedulesRouter.put('/:id');

// Xóa lịch trình vận chuyển
TransportSchedulesRouter.delete('/:id');

export default TransportSchedulesRouter;
