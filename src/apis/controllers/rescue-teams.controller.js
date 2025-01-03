import ResponseStatus from "../../response-handler/response-handler.js";
import RescueTeams from "../../databases/models/rescue-teams.model.js";
import Users from "../../databases/models/users.model.js";
import StatusHistory from "../../databases/models/status-history.model.js";
import TeamRescueUsers from "../../databases/models/team-rescue-users.js";

// Danh sách đội cứu trợ
export const getTeamsController = async (req, res) => {
  try {
    const { status } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }

    const teams = await RescueTeams.find(query).sort({ createdAt: -1 });

    return ResponseStatus.ok(res, teams);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Chi tiết đội
export const getTeamByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await RescueTeams.findById(id);
    if (!team) {
      return ResponseStatus.notfound(res);
    }

    return ResponseStatus.ok(res, team);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Tạo đội mới (gồm leaderId = người tạo)
export const createTeamController = async (req, res) => {
  try {
    const data = req.body;

    const newTeam = await RescueTeams.create({
      ...data,
      status: "deactive",
      leaderId: req.user?._id,
    });

    // Cập nhật rescueTeamId cho leader
    await Users.findByIdAndUpdate(req.user?._id, {
      $set: { rescueTeamId: newTeam._id },
    });

    // Tạo lịch sử
    await StatusHistory.create({
      referenceTable: "RescueTeams",
      referenceId: newTeam._id,
      action: "create",
      newStatus: "active",
      changedBy: req.user?._id,
    });

    const result = {
      message: "Tạo mới team thành công",
      data: newTeam,
    };

    return ResponseStatus.created(res, result);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Cập nhật thông tin (chỉ trưởng nhóm)
export const updateTeamController = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await RescueTeams.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return ResponseStatus.notfound(res);
    }
    const result = {
      message: "Đã cập nhật thông tin đội giải cứu",
      data: updated,
    };
    return ResponseStatus.ok(res, result);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Giải tán đội (chỉ trưởng nhóm)
export const deleteTeamController = async (req, res) => {
  try {
    const { id } = req.params;

    // Cập nhật trạng thái đội
    const deleted = await RescueTeams.findByIdAndUpdate(
      id,
      { $set: { status: "inactive" } },
      { new: true }
    );

    if (!deleted) {
      return ResponseStatus.notfound(res);
    }

    // Remove rescueTeamId của tất cả thành viên
    await Users.updateMany(
      { rescueTeamId: id },
      { $unset: { rescueTeamId: "" } }
    );

    // Tạo lịch sử
    await StatusHistory.create({
      referenceTable: "RescueTeams",
      referenceId: id,
      action: "delete",
      oldStatus: "active",
      newStatus: "inactive",
      changedBy: req.user?._id || "676452c5b85460f14f0b1d76",
    });

    return ResponseStatus.ok(res, { messsage: "Giải tán đội thành công" });
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Lấy danh sách thành viên
export const getTeamMembersController = async (req, res) => {
  try {
    const { rescueTeamId } = req.params;

    const members = await Users.find({ rescueTeamId: rescueTeamId }).select(
      "name phone role"
    );

    return ResponseStatus.ok(res, members);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Thêm thành viên
export const addTeamMemberController = async (req, res) => {
  try {
    const { rescueTeamId } = req.params;
    const { userId } = req.body;

    // Cập nhật rescueTeamId cho user
    const updated = await Users.findByIdAndUpdate(
      userId,
      { $set: { rescueTeamId: rescueTeamId } },
      { new: true }
    );

    if (!updated) {
      return ResponseStatus.notfound(res);
    }

    return ResponseStatus.ok(res, { message: "Thêm thành viên thành công" });
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Xóa thành viên
export const removeTeamMemberController = async (req, res) => {
  try {
    const { rescueTeamId, userId } = req.params;

    const updated = await Users.findByIdAndUpdate(
      userId,
      { $unset: { rescueTeamId: "" } },
      { new: true }
    );

    if (!updated) {
      return ResponseStatus.notfound(res);
    }

    return ResponseStatus.ok(res, { messsage: "Xóa thành viên thành công" });
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Gửi yêu cầu tham gia
export const sendJoinRequestController = async (req, res) => {
  try {
    const { rescueTeamId } = req.params;

    const { userId } = req.body;

    const newJoin = await TeamRescueUsers.create({
      rescueTeamId: rescueTeamId,
      userId: userId,
      status: "pending",
    });
    const result = {
      data: newJoin,
      message: "Gửi đơn gia nhập thành công",
    };
    // TODO: Implement join request logic

    return ResponseStatus.created(res, result);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Xem yêu cầu tham gia
export const getJoinRequestsController = async (req, res) => {
  try {
    const { rescueTeamId } = req.params;
    const listJoin = await TeamRescueUsers.find({
      rescueTeamId: rescueTeamId,
    })
      .populate("userId")
      .populate("rescueTeamId");

    return ResponseStatus.ok(res, listJoin);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Phê duyệt/từ chối yêu cầu tham gia
export const handleJoinRequestController = async (req, res) => {
  try {
    const { rescueTeamId, requestId } = req.params;
    const checkExists = await TeamRescueUsers.findByIdAndUpdate(requestId, {
      $set: {
        status: "active",
      },
    });
    if (!checkExists) {
      return ResponseStatus.badRequest(res, "Không tìm thấy yêu cầu");
    }
    await TeamRescueUsers.deleteMany({
      userId: req.user?._id || "676452c5b85460f14f0b1d76",
      _id: {
        $ne: checkExists._id,
      },
    });
    // TODO: Implement handle join request logic

    return ResponseStatus.ok(res, { message: "Xử lý yêu cầu thành công" });
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Chuyển quyền trưởng nhóm
export const changeTeamLeaderController = async (req, res) => {
  try {
    const { rescueTeamId, userId } = req.params;
    const checkExists = await RescueTeams.findByIdAndUpdate(rescueTeamId, {
      $set: {
        leaderId: userId,
      },
    });
    if (!checkExists) {
      return ResponseStatus.badRequest(res, "Không tìm thấy đội");
    }
    const result = {
      message: "Thay đổi đội trưởng thành công",
      data: checkExists,
    };
    return ResponseStatus.ok(res, result);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};
