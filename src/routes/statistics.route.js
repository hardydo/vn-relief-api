import { Router } from "express";

const StatisticsRouter = Router();

// Thống kê đội cứu trợ
StatisticsRouter.get('/rescue-teams');

// Thống kê quyên góp
StatisticsRouter.get('/donations');

// Thống kê yêu cầu
StatisticsRouter.get('/requests');

export default StatisticsRouter;
