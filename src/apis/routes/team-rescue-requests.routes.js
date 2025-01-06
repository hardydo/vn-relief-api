import express from "express";
import {
  getTeamRescueRequestsController,
  handleRescueRequestController,
  updateRequestStatusController,
} from "../controllers/team-rescue-requests.controller.js";
import {
  authMiddleware,
  teamMemberMiddleware,
} from "../middlewares/auth.middleware.js";

const teamRescueRequestsRouter = express.Router();

// Lấy danh sách đội cứu trợ nhận yêu cầu
teamRescueRequestsRouter.get(
  "/:rescueRequestId/rescue-team",
  authMiddleware,
  getTeamRescueRequestsController
);

// Danh sách các yêu cầu cứu trợ của đội cứu trợ
teamRescueRequestsRouter.get(
  "/rescue-teams/:teamRescueRequestsId/rescue-requests",
  authMiddleware,
  teamMemberMiddleware,
  getTeamRescueRequestsController
);

// Nhận/huỷ yêu cầu cứu trợ
teamRescueRequestsRouter.post(
  "/rescue-teams/:rescueTeamId/rescue-requests/:rescueRequestId",
  authMiddleware,
  teamMemberMiddleware,
  handleRescueRequestController
);

// Cập nhật trạng thái xử lý
teamRescueRequestsRouter.put(
  "/team-rescue-requests/:teamRescueRequestsId/status",
  authMiddleware,
  teamMemberMiddleware,
  updateRequestStatusController
);

export default teamRescueRequestsRouter;
