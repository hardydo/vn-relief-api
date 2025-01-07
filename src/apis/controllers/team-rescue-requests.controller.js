import ResponseStatus from "../../response-handler/response-handler.js";
import TeamRescueRequests from "../../databases/models/team-rescue-requests.model.js";
import RescueRequests from "../../databases/models/rescue-requests.model.js";
import StatusHistory from "../../databases/models/status-history.model.js";

// Danh sách yêu cầu được phân công cho đội
export const getTeamRescueRequestsController = async (req, res) => {
  try {
    const { teamRescueRequestsId } = req.params; // id của đội

    const requests = await TeamRescueRequests.find({
      rescueTeamId: teamRescueRequestsId,
    })
      .populate({
        path: "rescueRequestId",
        select: "type title description currentLocation wardCode",
      })
      .sort({ createdAt: -1 });

    return ResponseStatus.ok(res, requests);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Nhận/huỷ yêu cầu cứu trợ
export const handleRescueRequestController = async (req, res) => {
  try {
    const { rescueTeamId, rescueRequestId } = req.params;
    const { action } = req.body; // 'accept' or 'cancel'

    const teamRescueRequest = await TeamRescueRequests.findOne({
      rescueTeamId: rescueTeamId,
      rescueRequestId: rescueRequestId,
    });

    if (action === "accept") {
      if (teamRescueRequest) {
        return ResponseStatus.ok(res, {
          message: "Đã nhận đơn này rồi",
        });
      }

      // Create a new team rescue request
      const newTeamRescueRequest = await TeamRescueRequests.create({
        rescueTeamId: rescueTeamId,
        rescueRequestId: rescueRequestId,
        status: "accepted",
      });

      // Update rescue request status
      await RescueRequests.findByIdAndUpdate(rescueRequestId, {
        $set: {
          status: {
            recipient: "doing",
          },
        },
      });

      // Create status history
      await StatusHistory.create({
        referenceTable: "TeamRescueRequests",
        referenceId: newTeamRescueRequest._id,
        action: "accept",
        oldStatus: null,
        newStatus: "accepted",
        changedBy: req.user?._id || "676452c5b85460f14f0b1d76",
      });

      return ResponseStatus.ok(res, {
        message: "Nhận đơn thành công",
      });
    } else if (action === "cancel") {
      if (!teamRescueRequest) {
        return ResponseStatus.ok(res, {
          message: "Đơn này chưa được nhận",
        });
      }

      // Update team rescue request status to cancelled
      teamRescueRequest.status = "cancelled";
      await teamRescueRequest.save();

      // Update rescue request status
      await RescueRequests.findByIdAndUpdate(rescueRequestId, {
        $set: {
          status: {
            recipient: "cancelled",
          },
        },
      });

      // Create status history
      await StatusHistory.create({
        referenceTable: "TeamRescueRequests",
        referenceId: teamRescueRequest._id,
        action: "cancel",
        oldStatus: teamRescueRequest.status,
        newStatus: "cancelled",
        changedBy: req.user?._id || "676452c5b85460f14f0b1d76",
      });

      return ResponseStatus.ok(res, {
        message: "Hủy đơn thành công",
      });
    } else {
      return ResponseStatus.badRequest(res, {
        message: "Invalid action",
      });
    }
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Cập nhật trạng thái xử lý
export const updateRequestStatusController = async (req, res) => {
  try {
    const { teamRescueRequestsId } = req.params; // id của team_rescue_requests
    const { status, notes } = req.body;

    const teamRequest = await TeamRescueRequests.findById(teamRescueRequestsId);
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
      changedBy: req.user?._id || "676452c5b85460f14f0b1d76",
      description: notes,
    });

    const result = {
      data: teamRequest,
      messsage: "Cập nhật trạng thái thành công",
    };

    return ResponseStatus.ok(res, result);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};
