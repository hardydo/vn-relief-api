import { Router } from "express";

const UsersRouter = Router();

// - Lấy danh sách người dùng
UsersRouter.get('')
// - Lấy chi tiết người dùng
UsersRouter.get('/:id')
// - Tạo người dùng mới
UsersRouter.post('/roles')
// - Cập nhật thông tin người dùng
UsersRouter.put('/:id')
// - Block/Unlock người dùng (spam/lừa đảo)
UsersRouter.post('/:id/type')
// - Lấy đội cứu trợ của user
UsersRouter.get('/:id/rescue-teams')
// - Xin tham gia đội
UsersRouter.post('/:id/rescue-teams/:teamId/join')
// - Rời đội
UsersRouter.put('/:id/rescue-teams/:teamId/leave')
// - Lấy đội mà user đang làm trưởng nhóm
UsersRouter.get('/:id/leader-teams')
// - Lấy danh sách roles của user
UsersRouter.get('/:id/roles')
// - Thêm role cho user
UsersRouter.post('/:id/roles')
// - Xóa role của user
UsersRouter.delete('/:id/roles/:roleId')

export default UsersRouter;
