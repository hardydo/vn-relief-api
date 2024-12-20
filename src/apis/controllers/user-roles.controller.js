import ResponseStatus from "../../response-handler/response-handler.js";
import UserRoles from "../../databases/models/user-roles.model.js";
import Users from "../../databases/models/users.model.js";
import Roles from "../../databases/models/roles.model.js";
import StatusHistory from "../../databases/models/status-history.model.js";

// Lấy roles của user
export const getUserRolesController = async (req, res) => {
  try {
    const { id } = req.params;

    const userRoles = await UserRoles.find({ userId: id })
      .populate("roleId", "name code")
      .sort({ createdAt: -1 });

    return ResponseStatus.ok(res, userRoles);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Cập nhật roles cho user
export const updateUserRolesController = async (req, res) => {
  try {
    const { id } = req.params;
    const { roles } = req.body; // Mảng roleIds

    // Kiểm tra user tồn tại
    const user = await Users.findById(id);
    if (!user) {
      return ResponseStatus.notfound(res);
    }

    // Kiểm tra các role tồn tại
    const existingRoles = await Roles.find({ _id: { $in: roles } });
    if (existingRoles.length !== roles.length) {
      return ResponseStatus.badRequest(res, "Một số role không tồn tại");
    }

    // Lấy roles hiện tại của user
    const currentRoles = await UserRoles.find({ userId: id }).select("roleId");
    const currentRoleIds = currentRoles.map((ur) => ur.roleId.toString());

    // Xác định roles cần thêm và xóa
    const rolesToAdd = roles.filter((r) => !currentRoleIds.includes(r));
    const rolesToRemove = currentRoleIds.filter((r) => !roles.includes(r));

    // Thêm roles mới
    if (rolesToAdd.length > 0) {
      await UserRoles.insertMany(
        rolesToAdd.map((roleId) => ({
          userId: id,
          roleId,
        }))
      );
    }

    // Xóa roles cũ
    if (rolesToRemove.length > 0) {
      await UserRoles.deleteMany({
        userId: id,
        roleId: { $in: rolesToRemove },
      });
    }

    // Tạo lịch sử
    await StatusHistory.create({
      referenceTable: "UserRoles",
      referenceId: id,
      action: "update_roles",
      oldStatus: currentRoleIds.join(","),
      newStatus: roles.join(","),
      changedBy: req.user?._id,
    });

    // Lấy danh sách roles mới
    const updatedRoles = await UserRoles.find({ userId: id }).populate(
      "roleId",
      "name code"
    );

    return ResponseStatus.ok(res, updatedRoles);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};
