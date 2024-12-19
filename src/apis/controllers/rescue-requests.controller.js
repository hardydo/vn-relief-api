import ResponseStatus from "../../response-handler/response-handler.js";
import RescueRequests from "../../databases/models/rescue-requests.model.js";
import TeamRescueRequests from "../../databases/models/team-rescue-requests.model.js";
import StatusHistory from "../../databases/models/status-history.model.js";

// Lấy danh sách yêu cầu cứu trợ
export const getRescueRequestsController = async (req, res) => {
  try {
    const { status, type, area, nearby } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }
    if (type) {
      query.type = type;
    }
    if (area) {
      query.wardCode = area;
    }
    if (nearby === "true" && req.user?.wardCode) {
      // Lọc yêu cầu gần người dùng dựa trên mã địa phương
      const [userWard, userDistrict, userProvince] =
        req.user.wardCode.split("|");
      query.wardCode = {
        $in: [req.user.wardCode, `${userWard}|${userDistrict}`, `${userWard}`],
      };
    }

    const requests = await RescueRequests.find(query)
      .populate("informantId", "name phone")
      .sort({ createdAt: -1 });

    return ResponseStatus.ok(res, requests);
  } catch (error) {
    return ResponseStatus.error(res);
  }
};

// Chi tiết yêu cầu
export const getRescueRequestByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await RescueRequests.findById(id)
      .populate("informantId", "name phone")
      .populate("verifierId", "name phone");

    if (!request) {
      return ResponseStatus.notfound(res);
    }

    return ResponseStatus.ok(res, request);
  } catch (error) {
    return ResponseStatus.error(res);
  }
};

// Tạo yêu cầu mới
export const createRescueRequestController = async (req, res) => {
  try {
    const data = req.body;

    const newRequest = await RescueRequests.create({
      ...data,
      informantId: req.user._id,
    });

    // Tạo lịch sử trạng thái
    await StatusHistory.create({
      referenceTable: "RescueRequests",
      referenceId: newRequest._id,
      action: "create",
      newStatus: "pending",
      changedBy: req.user._id,
    });

    return ResponseStatus.created(res, newRequest);
  } catch (error) {
    return ResponseStatus.error(res);
  }
};

// Cập nhật yêu cầu (chỉ được cập nhật trước khi có đội nhận)
export const updateRescueRequestController = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Kiểm tra có đội nào nhận chưa
    const assignedTeam = await TeamRescueRequests.findOne({
      rescueRequestId: id,
    });
    if (assignedTeam) {
      return ResponseStatus.forbidden(
        res,
        "Không thể cập nhật khi đã có đội nhận"
      );
    }

    const updated = await RescueRequests.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return ResponseStatus.notfound(res);
    }

    return ResponseStatus.ok(res, updated);
  } catch (error) {
    return ResponseStatus.error(res);
  }
};

// Xóa yêu cầu (chỉ được xóa khi chưa có đội nhận)
export const deleteRescueRequestController = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra có đội nào nhận chưa
    const assignedTeam = await TeamRescueRequests.findOne({
      rescueRequestId: id,
    });
    if (assignedTeam) {
      return ResponseStatus.forbidden(res, "Không thể xóa khi đã có đội nhận");
    }

    const deleted = await RescueRequests.findByIdAndDelete(id);

    if (!deleted) {
      return ResponseStatus.notfound(res);
    }

    return ResponseStatus.ok(res, "Xóa thành công");
  } catch (error) {
    return ResponseStatus.error(res);
  }
};

// Xác minh yêu cầu (TNV xác minh)
export const verifyRescueRequestController = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await RescueRequests.findByIdAndUpdate(
      id,
      {
        $set: {
          verifierId: req.user._id,
          status: "verified",
        },
      },
      { new: true }
    );

    if (!updated) {
      return ResponseStatus.notfound(res);
    }

    // Tạo lịch sử trạng thái
    await StatusHistory.create({
      referenceTable: "RescueRequests",
      referenceId: id,
      action: "verify",
      oldStatus: "pending",
      newStatus: "verified",
      changedBy: req.user._id,
    });

    return ResponseStatus.ok(res, updated);
  } catch (error) {
    return ResponseStatus.error(res);
  }
};

// Cập nhật trạng thái (chỉ đội cứu trợ)
export const updateStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Kiểm tra yêu cầu được gán cho đội của user
    const teamRequest = await TeamRescueRequests.findOne({
      rescueRequestId: id,
      rescueTeamId: req.user.rescueTeamId,
    });

    if (!teamRequest) {
      return ResponseStatus.forbidden(res, "Không có quyền cập nhật");
    }

    const oldStatus = teamRequest.status;
    teamRequest.status = status;
    await teamRequest.save();

    // Tạo lịch sử trạng thái
    await StatusHistory.create({
      referenceTable: "TeamRescueRequests",
      referenceId: teamRequest._id,
      action: "update_status",
      oldStatus,
      newStatus: status,
      changedBy: req.user._id,
    });

    return ResponseStatus.ok(res, teamRequest);
  } catch (error) {
    return ResponseStatus.error(res);
  }
};

// Phân công cho đội (TNV role xác minh)
export const assignTeamController = async (req, res) => {
  try {
    const { id, teamId } = req.params;

    const newAssignment = await TeamRescueRequests.create({
      rescueRequestId: id,
      rescueTeamId: teamId,
      status: "pending",
    });

    // Cập nhật trạng thái yêu cầu
    await RescueRequests.findByIdAndUpdate(id, {
      $set: { status: "assigned" },
    });

    // Tạo lịch sử trạng thái
    await StatusHistory.create({
      referenceTable: "RescueRequests",
      referenceId: id,
      action: "assign",
      oldStatus: "verified",
      newStatus: "assigned",
      changedBy: req.user._id,
      description: `Assigned to team ${teamId}`,
    });

    return ResponseStatus.created(res, newAssignment);
  } catch (error) {
    return ResponseStatus.error(res);
  }
};
