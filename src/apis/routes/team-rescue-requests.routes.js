import express from "express";
import {
  getTeamRescueRequestsController,
  handleRescueRequestController,
  updateRequestStatusController
} from "../controllers/team-rescue-requests.controller.js";
import { authMiddleware, teamMemberMiddleware } from "../middlewares/auth.middleware.js";

const teamRescueRequestsRouter = express.Router();

// Danh sách yêu cầu được phân công cho đội
teamRescueRequestsRouter.get("/rescue-teams/:id/rescue-requests", authMiddleware, teamMemberMiddleware, getTeamRescueRequestsController);

// Nhận/huỷ yêu cầu cứu trợ 
teamRescueRequestsRouter.post("/rescue-teams/:id/rescue-requests/:requestId", authMiddleware, teamMemberMiddleware, handleRescueRequestController);

// Cập nhật trạng thái xử lý
teamRescueRequestsRouter.put("/team-rescue-requests/:id/status", authMiddleware, teamMemberMiddleware, updateRequestStatusController);

export default teamRescueRequestsRouter;