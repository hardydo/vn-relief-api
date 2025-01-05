import ResponseStatus from "../../response-handler/response-handler.js";
import UserRoles from "../../databases/models/user-roles.model.js";
import Users from "../../databases/models/users.model.js";
import Roles from "../../databases/models/roles.model.js";
import StatusHistory from "../../databases/models/status-history.model.js";

// Lấy roles (accept) của user
export const getUserRolesController = async (req, res) => {
  try {
    const { id } = req.params;

    const userRoles = await UserRoles.find({ userId: id, status: "accept" })
      .populate("roleId")
      .populate("userId")
      .sort({ createdAt: -1 });

    return ResponseStatus.ok(res, userRoles);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Tạo role mới cho user
export const updateUserRolesController = async (req, res) => {
  try {
    const { userId } = req.params;
    const roles = req.body; // Expect an array of { roleId, status }

    if (!Array.isArray(roles) || roles.length === 0) {
      return ResponseStatus.badRequest(res, "Dữ liệu truyền vào không hợp lệ");
    }

    // Kiểm tra user tồn tại
    const user = await Users.findById(userId);
    if (!user) {
      return ResponseStatus.notfound(res, "Không tìm thấy người dùng");
    }

    // Lấy danh sách roleId từ database để kiểm tra
    const roleIds = roles.map((role) => role.roleId);
    const validRoles = await Roles.find({ _id: { $in: roleIds } });

    if (validRoles.length !== roleIds.length) {
      return ResponseStatus.badRequest(
        res,
        "Một hoặc nhiều vai trò không hợp lệ"
      );
    }

    // Lấy danh sách các role đã tồn tại cho user
    const existingUserRoles = await UserRoles.find({
      userId,
      roleId: { $in: roleIds },
      status: { $in: ["pending", "accept"] },
    });

    // Loại bỏ các role đã tồn tại
    const newRoles = roles.filter(
      (role) =>
        !existingUserRoles.some(
          (existingRole) =>
            existingRole.roleId.toString() === role.roleId &&
            ["pending", "accept"].includes(existingRole.status)
        )
    );

    if (newRoles.length === 0) {
      return ResponseStatus.badRequest(
        res,
        "Tất cả các vai trò đã tồn tại hoặc đang chờ phê duyệt"
      );
    }

    // Tạo các bản ghi mới với insertMany
    const roleRequests = newRoles.map((role) => ({
      userId,
      roleId: role.roleId,
      status: role.status || "pending",
    }));

    const createdRoles = await UserRoles.insertMany(roleRequests);

    // Tạo lịch sử cho mỗi vai trò mới
    const statusHistory = createdRoles.map((newRole) => ({
      referenceTable: "UserRoles",
      referenceId: newRole._id,
      action: "request_role",
      newStatus: newRole.status,
      changedBy: userId,
      description: `Yêu cầu thêm vai trò ${newRole.roleId}`,
    }));

    await StatusHistory.insertMany(statusHistory);

    const result = {
      data: {
        ...(await Users.findById(userId).lean()), // Lấy thông tin người dùng
        roles: await UserRoles.find({ userId }) // Tìm tất cả các vai trò của user
          .populate("roleId") // Populate thông tin chi tiết của role
          .lean()
          .then((userRoles) =>
            userRoles.map((ur) => ({
              roleId: ur.roleId._id,
              name: ur.roleId.name,
              description: ur.roleId.description,
              status: ur.status,
            }))
          ),
      },
      message: "Đã gửi yêu cầu thêm quyền thành công",
    };

    return ResponseStatus.created(res, result);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};
