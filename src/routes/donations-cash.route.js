import { Router } from "express";

const DonationsCashRouter = Router();

// Ghi nhận tiền mặt từ người dân đóng góp
DonationsCashRouter.post('/record');

// PUT `/donations/cash/record`
// Sửa thông tin tiền mặt từ người dân đóng góp
DonationsCashRouter.put('/record');

export default DonationsCashRouter;
