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
    if (nearby === "true" && (req.user?.wardCode || " ")) {
      // Lọc yêu cầu gần người dùng dựa trên mã địa phương
      const wardCode = req.user?.wardCode || "01|23|34";
      const [userWard, userDistrict, userProvince] = wardCode.split("|");
      query.wardCode = {
        $in: [
          req.user?.wardCode || "01|23|34",
          `${userWard}|${userDistrict}`,
          `${userWard}`,
        ],
      };
    }

    const requests = await RescueRequests.find(query)
      .populate("informantId", "name phone")
      .sort({ createdAt: -1 });

    return ResponseStatus.ok(res, requests);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
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
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Tạo yêu cầu mới
export const createRescueRequestController = async (req, res) => {
  try {
    const data = req.body;

    const newRequest = await RescueRequests.create({
      ...data,
      informantId: req.user?._id || "676452c5b85460f14f0b1d76",
      status: "pending",
    });

    // Tạo lịch sử trạng thái
    await StatusHistory.create({
      referenceTable: "RescueRequests",
      referenceId: newRequest._id,
      action: "create",
      newStatus: "pending",
      changedBy: req.user?._id || "676452c5b85460f14f0b1d76",
    });
    const result = {
      data: newRequest,
      message: "Tạo yêu cầu hỗ trợ thành công"
    }
    return ResponseStatus.created(res, result);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
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
    const result = {
      message: "Cập nhật thông tin cứu trợ thành công",
      data: updated
    }
    return ResponseStatus.ok(res, result);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
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

    return ResponseStatus.ok(res, {message: "Xóa thành công"});
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
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
          verifierId: req.user?._id || "676452c5b85460f14f0b1d76",
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
      changedBy: req.user?._id || "676452c5b85460f14f0b1d76",
    });

    return ResponseStatus.ok(res, updated);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
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
      rescueTeamId: req.user?.rescueTeamId || "6764524cb85460f14f0b1d70",
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
      changedBy: req.user?._id || "676452c5b85460f14f0b1d76",
    });

    return ResponseStatus.ok(res, teamRequest);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
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
      changedBy: req.user?._id || "676452c5b85460f14f0b1d76",
      description: `Assigned to team ${teamId}`,
    });

    return ResponseStatus.created(res, newAssignment);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};
