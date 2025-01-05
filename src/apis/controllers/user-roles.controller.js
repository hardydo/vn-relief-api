import ResponseStatus from "../../response-handler/response-handler.js";
import UserRoles from "../../databases/models/user-roles.model.js";
import Users from "../../databases/models/users.model.js";
import Roles from "../../databases/models/roles.model.js";
import StatusHistory from "../../databases/models/status-history.model.js";

// Lấy roles của user
export const getUserRolesController = async (req, res) => {
  try {
    const { id } = req.params;

    const userRoles = await UserRoles.find({ userId: id, status: "accept" })
      .populate("roleId", "name code")
      .populate("userId")
      .sort({ createdAt: -1 });

    return ResponseStatus.ok(res, userRoles);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Xin thêm quyền (xin add thêm role TNV, TVĐCY)
export const requestNewRoleController = async (req, res) => {
  try {
    const { userId } = req.params;
    const { roleId } = req.body;

    // Kiểm tra user tồn tại
    const user = await Users.findById(userId);
    if (!user) {
      return ResponseStatus.notfound(res, "Không tìm thấy người dùng");
    }

    // Kiểm tra role tồn tại
    const role = await Roles.findById(roleId);
    if (!role) {
      return ResponseStatus.notfound(res, "Không tìm thấy vai trò này");
    }

    // Kiểm tra xem user đã có role này chưa
    const existingUserRole = await UserRoles.findOne({
      userId,
      roleId,
      status: { $in: ["pending", "accept"] },
    });

    if (existingUserRole) {
      if (existingUserRole.status === "pending") {
        return ResponseStatus.badRequest(
          res,
          "Bạn đã gửi yêu cầu và đang chờ phê duyệt"
        );
      }
      if (existingUserRole.status === "accept") {
        return ResponseStatus.badRequest(res, "Bạn đã có vai trò này");
      }
    }

    // Tạo yêu cầu xin quyền mới
    const newRoleRequest = await UserRoles.create({
      userId,
      roleId,
      status: "pending", // Trạng thái chờ phê duyệt
    });

    // Tạo lịch sử
    await StatusHistory.create({
      referenceTable: "UserRoles",
      referenceId: newRoleRequest._id,
      action: "request_role",
      newStatus: "pending",
      changedBy: userId,
      description: `Yêu cầu thêm vai trò ${role.name}`,
    });

    const result = {
      data: await UserRoles.findById(newRoleRequest._id)
        .populate("roleId", "name code")
        .populate("userId", "name phone"),
      message: "Đã gửi yêu cầu thêm quyền thành công",
    };

    return ResponseStatus.created(res, result);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Cập nhật roles cho user
export const updateUserRolesController = async (req, res) => {
  try {
    const { userId } = req.params;
    const { roles } = req.body; // Mảng roleIds

    // Kiểm tra user tồn tại
    const user = await Users.findById(userId);
    if (!user) {
      return ResponseStatus.notfound(res);
    }

    // Kiểm tra các role tồn tại
    const existingRoles = await Roles.find({ _id: { $in: roles } });
    if (existingRoles.length !== roles.length) {
      return ResponseStatus.badRequest(res, "Một số role không tồn tại");
    }

    // Lấy roles hiện tại của user
    const currentRoles = await UserRoles.find({ userId }).select("roleId");
    const currentRoleIds = currentRoles.map((ur) => ur.roleId.toString());

    // Xác định roles cần thêm và xóa
    const rolesToAdd = roles.filter((r) => !currentRoleIds.includes(r));
    const rolesToRemove = currentRoleIds.filter((r) => !roles.includes(r));

    // Thêm roles mới
    if (rolesToAdd.length > 0) {
      await UserRoles.insertMany(
        rolesToAdd.map((roleId) => ({
          userId,
          roleId,
        }))
      );
    }

    // Xóa roles cũ
    if (rolesToRemove.length > 0) {
      await UserRoles.deleteMany({
        userId,
        roleId: { $in: rolesToRemove },
      });
    }

    // Tạo lịch sử
    await StatusHistory.create({
      referenceTable: "UserRoles",
      referenceId: userId,
      action: "update_roles",
      oldStatus: currentRoleIds.join(","),
      newStatus: roles.join(","),
      changedBy: req.user?._id || "676452c5b85460f14f0b1d76",
    });

    // Lấy danh sách roles mới
    const updatedRoles = await UserRoles.find({ userId }).populate(
      "roleId",
      "name code"
    );

    const result = {
      data: updatedRoles,
      messsage: "Cập nhật vai trò người dùng thành công",
    };

    return ResponseStatus.ok(res, result);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};
