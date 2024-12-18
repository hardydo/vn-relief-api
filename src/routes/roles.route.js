import { Router } from "express";

const RolesRouter = Router();

// - Lấy danh sách các role của web
RolesRouter.get('')
// - Thêm role mới
RolesRouter.post('')
// - Sửa role 
RolesRouter.put('/:id')
// - Xoá role
RolesRouter.delete('/:id')


export default RolesRouter;
