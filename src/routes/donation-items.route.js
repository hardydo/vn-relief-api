import { Router } from "express";

const DonationItemsRouter = Router();

// 1. Chi tiết hàng đóng góp của một user tới địa điểm hỗ trợ
DonationItemsRouter.get('/:userId');

// 2. Thêm hàng mới
DonationItemsRouter.post('/');

// 3. Cập nhật thông tin hàng cứu trợ (tăng/giảm số lượng, thêm hàng)
DonationItemsRouter.put('/:id');

// 4. Xóa hàng cứu trợ
DonationItemsRouter.delete('/:id');

// 5. Chi tiết các items trong 1 "hàng cứu trợ"
DonationItemsRouter.get('/:id/detail');

export default DonationItemsRouter;
