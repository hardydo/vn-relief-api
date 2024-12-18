import { Router } from "express";

const RescueTeamsRouter = Router();

// - Lấy danh sách đội 
RescueTeamsRouter.get("")
// - Chi tiết đội
RescueTeamsRouter.get("/:id")
// - Tạo đội mới
RescueTeamsRouter.post("")
// - Cập nhật thông tin đội
RescueTeamsRouter.put("/:id")
// - Giải tán đội
RescueTeamsRouter.delete("/:id")
// - Danh sách thành viên
RescueTeamsRouter.get("/:id/members")
// - Thêm thành viên
RescueTeamsRouter.post("/:id/members")
// - Xóa thành viên
RescueTeamsRouter.delete("/:id/members/:userId")
// - Chuyển quyền đội trưởng cho thành viên khác
RescueTeamsRouter.put("/:id/leader/:userId")
// - Xem yêu cầu tham gia
RescueTeamsRouter.get("/:id/requests")
// - Duyệt/từ chối yêu cầu
RescueTeamsRouter.put("/:id/requests/:reqId")
// - Xem các nhiệm vụ cứu trợ của đội
RescueTeamsRouter.get("/:id/missions")
// - Nhiệm vụ đang thực hiện
RescueTeamsRouter.get("/:id/active-missions")
// - Nhận nhiệm vụ mới
RescueTeamsRouter.post("/:id/missions")
// - Cập nhật tiến độ cứu trợ
RescueTeamsRouter.put("/:id/missions/:missionId")

export default RescueTeamsRouter;
