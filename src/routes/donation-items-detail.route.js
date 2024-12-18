import { Router } from "express";

const DonationItemsDetailRouter = Router();

// Lấy chi tiết các items trong 1 "hàng cứu trợ"
DonationItemsDetailRouter.get('/:id/detail');

export default DonationItemsDetailRouter;
