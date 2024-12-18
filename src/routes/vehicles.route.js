import { Router } from "express";

const VehiclesRouter = Router();

// - Danh sách tất cả phương tiện
VehiclesRouter.get('/');

// - Chi tiết phương tiện
VehiclesRouter.get('/:id');

// - Đăng ký phương tiện
VehiclesRouter.post('/');

// - Sửa thông tin phương tiện
VehiclesRouter.put('/:id');

// - Xoá phương tiện
VehiclesRouter.delete('/:id');

export default VehiclesRouter;
