import express from "express";
import {
  getRescueTeamsStatsController,
  getContributionsStatsController,
  getRescueRequestsStatsController,
  getTransportStatsController
} from "../controllers/statistics.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const statisticsRouter = express.Router();

// Thống kê đội cứu trợ
statisticsRouter.get("/rescue-teams", authMiddleware, getRescueTeamsStatsController);

// Thống kê đóng góp
statisticsRouter.get("/contributions", authMiddleware, getContributionsStatsController);

// Thống kê yêu cầu cứu trợ  
statisticsRouter.get("/rescue-requests", authMiddleware, getRescueRequestsStatsController);

// Thống kê vận chuyển
statisticsRouter.get("/transport", authMiddleware, getTransportStatsController);

export default statisticsRouter;