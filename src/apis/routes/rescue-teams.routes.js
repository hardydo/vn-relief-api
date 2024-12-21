import express from "express";
import {
  getTeamsController,
  getTeamByIdController,
  createTeamController,
  updateTeamController,
  deleteTeamController,
  getTeamMembersController,
  addTeamMemberController,
  removeTeamMemberController,
  sendJoinRequestController,
  getJoinRequestsController,
  handleJoinRequestController,
  changeTeamLeaderController
} from "../controllers/rescue-teams.controller.js";
import { authMiddleware, teamLeaderMiddleware } from "../middlewares/auth.middleware.js";

const rescueTeamsRouter = express.Router();

// Danh sách đội cứu trợ
// Query: status (active | inactive)
rescueTeamsRouter.get("/", authMiddleware, getTeamsController);

// Chi tiết đội
rescueTeamsRouter.get("/:id", authMiddleware, getTeamByIdController);

// Tạo đội mới (gồm leaderId = người tạo)
rescueTeamsRouter.post("/", authMiddleware, createTeamController);

// Cập nhật thông tin (chỉ trưởng nhóm)
rescueTeamsRouter.put("/:id", authMiddleware, teamLeaderMiddleware, updateTeamController);

// Giải tán đội (chỉ trưởng nhóm)
rescueTeamsRouter.delete("/:id", authMiddleware, teamLeaderMiddleware, deleteTeamController);

// Quản lý thành viên
rescueTeamsRouter.get(
  "/:rescueTeamId/members",
  authMiddleware,
  getTeamMembersController
);
rescueTeamsRouter.post(
  "/:rescueTeamId/members",
  authMiddleware,
  teamLeaderMiddleware,
  addTeamMemberController
);
rescueTeamsRouter.delete(
  "/:rescueTeamId/members/:userId",
  authMiddleware,
  teamLeaderMiddleware,
  removeTeamMemberController
);

// Quản lý yêu cầu tham gia
rescueTeamsRouter.post("/:rescueTeamId/join-requests", authMiddleware, sendJoinRequestController);
rescueTeamsRouter.get("/:rescueTeamId/join-requests", authMiddleware, teamLeaderMiddleware, getJoinRequestsController);
rescueTeamsRouter.put("/:rescueTeamId/join-requests/:requestId", authMiddleware, teamLeaderMiddleware, handleJoinRequestController);

// Chuyển quyền trưởng nhóm
rescueTeamsRouter.put("/:rescueTeamId/leader/:userId", authMiddleware, teamLeaderMiddleware, changeTeamLeaderController);

export default rescueTeamsRouter;