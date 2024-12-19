import ResponseStatus from "../../response-handler/response-handler.js";
import TeamRescueRequests from "../../databases/models/team-rescue-requests.model.js";
import RescueRequests from "../../databases/models/rescue-requests.model.js";
import StatusHistory from "../../databases/models/status-history.model.js";

// Danh sách yêu cầu được phân công cho đội
export const getTeamRescueRequestsController = async (req, res) => {
  try {
    const { id } = req.params; // id của đội

    const requests = await TeamRescueRequests.find({ rescueTeamId: id })
      .populate({
        path: "rescueRequestId",
        select: "type title description currentLocation wardCode",
      })
      .sort({ createdAt: -1 });

    return ResponseStatus.ok(res, requests);
  } catch (error) {
    return ResponseStatus.error(res);
  }
};

// Nhận/huỷ yêu cầu cứu trợ
export const handleRescueRequestController = async (req, res) => {
  try {
    const { id, requestId } = req.params;
    const { action } = req.body; // 'accept' hoặc 'cancel'

    const teamRequest = await TeamRescueRequests.findOne({
      rescueTeamId: id,
      rescueRequestId: requestId,
    });

    if (!teamRequest) {
      return ResponseStatus.notfound(res);
    }

    // Cập nhật trạng thái
    const status = action === "accept" ? "accepted" : "cancelled";
    teamRequest.status = status;
    await teamRequest.save();

    // Cập nhật status của rescue request
    await RescueRequests.findByIdAndUpdate(requestId, { $set: { status } });

    // Tạo lịch sử
    await StatusHistory.create({
      referenceTable: "TeamRescueRequests",
      referenceId: teamRequest._id,
      action,
      oldStatus: teamRequest.status,
      newStatus: status,
      changedBy: req.user._id,
    });

    return ResponseStatus.ok(res, "Cập nhật trạng thái thành công");
  } catch (error) {
    return ResponseStatus.error(res);
  }
};

// Cập nhật trạng thái xử lý
export const updateRequestStatusController = async (req, res) => {
  try {
    const { id } = req.params; // id của team_rescue_requests
    const { status, notes } = req.body;

    const teamRequest = await TeamRescueRequests.findById(id);
    if (!teamRequest) {
      return ResponseStatus.notfound(res);
    }

    const oldStatus = teamRequest.status;

    // Cập nhật trạng thái
    teamRequest.status = status;
    if (notes) {
      teamRequest.notes = notes;
    }
    await teamRequest.save();

    // Cập nhật status của rescue request nếu cần
    if (status === "completed") {
      await RescueRequests.findByIdAndUpdate(teamRequest.rescueRequestId, {
        $set: { status: "completed" },
      });
    }

    // Tạo lịch sử
    await StatusHistory.create({
      referenceTable: "TeamRescueRequests",
      referenceId: id,
      action: "update_status",
      oldStatus,
      newStatus: status,
      changedBy: req.user._id,
      description: notes,
    });

    return ResponseStatus.ok(res, teamRequest);
  } catch (error) {
    return ResponseStatus.error(res);
  }
};
