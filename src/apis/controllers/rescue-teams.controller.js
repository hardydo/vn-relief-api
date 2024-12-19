import ResponseStatus from "../../response-handler/response-handler.js";
import RescueTeams from "../../databases/models/rescue-teams.model.js";
import Users from "../../databases/models/users.model.js";
import StatusHistory from "../../databases/models/status-history.model.js";

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
    return ResponseStatus.error(res);
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
    return ResponseStatus.error(res);
  }
};

// Tạo đội mới (gồm leaderId = người tạo)
export const createTeamController = async (req, res) => {
  try {
    const data = req.body;

    const newTeam = await RescueTeams.create({
      ...data,
      status: "active",
    });

    // Cập nhật rescueTeamId cho leader
    await Users.findByIdAndUpdate(req.user._id, {
      $set: { rescueTeamId: newTeam._id },
    });

    // Tạo lịch sử
    await StatusHistory.create({
      referenceTable: "RescueTeams",
      referenceId: newTeam._id,
      action: "create",
      newStatus: "active",
      changedBy: req.user._id,
    });

    return ResponseStatus.created(res, newTeam);
  } catch (error) {
    return ResponseStatus.error(res);
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

    return ResponseStatus.ok(res, updated);
  } catch (error) {
    return ResponseStatus.error(res);
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
      changedBy: req.user._id,
    });

    return ResponseStatus.ok(res, "Giải tán đội thành công");
  } catch (error) {
    return ResponseStatus.error(res);
  }
};

// Lấy danh sách thành viên
export const getTeamMembersController = async (req, res) => {
  try {
    const { id } = req.params;

    const members = await Users.find({ rescueTeamId: id }).select(
      "name phone role"
    );

    return ResponseStatus.ok(res, members);
  } catch (error) {
    return ResponseStatus.error(res);
  }
};

// Thêm thành viên
export const addTeamMemberController = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    // Cập nhật rescueTeamId cho user
    const updated = await Users.findByIdAndUpdate(
      userId,
      { $set: { rescueTeamId: id } },
      { new: true }
    );

    if (!updated) {
      return ResponseStatus.notfound(res);
    }

    return ResponseStatus.ok(res, "Thêm thành viên thành công");
  } catch (error) {
    return ResponseStatus.error(res);
  }
};

// Xóa thành viên
export const removeTeamMemberController = async (req, res) => {
  try {
    const { id, userId } = req.params;

    const updated = await Users.findByIdAndUpdate(
      userId,
      { $unset: { rescueTeamId: "" } },
      { new: true }
    );

    if (!updated) {
      return ResponseStatus.notfound(res);
    }

    return ResponseStatus.ok(res, "Xóa thành viên thành công");
  } catch (error) {
    return ResponseStatus.error(res);
  }
};

// Gửi yêu cầu tham gia
export const sendJoinRequestController = async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Implement join request logic

    return ResponseStatus.created(res, "Gửi yêu cầu thành công");
  } catch (error) {
    return ResponseStatus.error(res);
  }
};

// Xem yêu cầu tham gia
export const getJoinRequestsController = async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Implement get join requests logic

    return ResponseStatus.ok(res, []);
  } catch (error) {
    return ResponseStatus.error(res);
  }
};

// Phê duyệt/từ chối yêu cầu tham gia
export const handleJoinRequestController = async (req, res) => {
  try {
    const { id, requestId } = req.params;
    const { status } = req.body;

    // TODO: Implement handle join request logic

    return ResponseStatus.ok(res, "Xử lý yêu cầu thành công");
  } catch (error) {
    return ResponseStatus.error(res);
  }
};

// Chuyển quyền trưởng nhóm
export const changeTeamLeaderController = async (req, res) => {
  try {
    const { id, userId } = req.params;

    // TODO: Implement change team leader logic

    return ResponseStatus.ok(res, "Chuyển quyền trưởng nhóm thành công");
  } catch (error) {
    return ResponseStatus.error(res);
  }
};
