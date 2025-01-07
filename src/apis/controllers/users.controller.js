import Roles from "../../databases/models/roles.model.js";
import StatusHistory from "../../databases/models/status-history.model.js";
import UserRoles from "../../databases/models/user-roles.model.js";
import Users from "../../databases/models/users.model.js";
import ResponseStatus from "../../response-handler/response-handler.js";

// Lấy danh sách user theo mảng role và kèm user role
export const getUsersByRoleIdController = async (req, res) => {
  try {
    const { roles } = req.query; // Lấy danh sách `code` từ query
    if (!roles) {
      return ResponseStatus.badRequest(res, "Roles parameter is required");
    }

    // Chuyển chuỗi `roles` thành mảng
    const roleCodes = roles.split(",").map((code) => parseInt(code.trim(), 10));

    // Lấy danh sách `roleId` dựa trên `code` trong collection `Roles`
    const roleList = await Roles.find({ code: { $in: roleCodes } }).select(
      "_id"
    );
    const roleIds = roleList.map((role) => role._id);

    if (!roleIds.length) {
      return ResponseStatus.notfound(
        res,
        "No roles matched the provided codes"
      );
    }

    // Lấy danh sách `userId` từ `UserRoles` dựa trên `roleId`
    const userRoles = await UserRoles.find({
      roleId: { $in: roleIds },
      status: "accept", // Chỉ lấy các vai trò đã được chấp nhận
    })
      .populate("roleId", "code name") // Populate để lấy thông tin `code` và `name` của vai trò
      .select("userId roleId status");

    // Lấy mảng `userId` từ kết quả
    const userIds = userRoles.map((ur) => ur.userId);

    if (!userIds.length) {
      return ResponseStatus.notfound(
        res,
        "No users found for the provided role codes"
      );
    }

    // Lọc danh sách người dùng theo `userId`
    const users = await Users.find({ _id: { $in: userIds } });

    // Kết hợp thông tin user và user role
    const usersWithRoles = users.map((user) => {
      const rolesForUser = userRoles
        .filter((ur) => ur.userId.toString() === user._id.toString())
        .map((ur) => ({
          roleId: ur.roleId._id,
          roleCode: ur.roleId.code,
          roleName: ur.roleId.name,
          status: ur.status,
        }));

      return {
        ...user.toObject(), // Chuyển `user` sang dạng object
        roles: rolesForUser, // Thêm thông tin roles
      };
    });

    // Trả về danh sách người dùng kèm vai trò
    return ResponseStatus.ok(res, usersWithRoles);
  } catch (error) {
    console.error(error);
    return ResponseStatus.error(res, error);
  }
};

// Lấy danh sách users
export const getUsersController = async (req, res) => {
  try {
    const { roles, status, search } = req.query;

    let query = {};

    // Filter by roles
    if (roles) {
      const roleIds = roles.split(",");
      const userRoles = await UserRoles.find({ roleId: { $in: roleIds } });
      const userIds = userRoles.map((ur) => ur.userId);
      query._id = { $in: userIds };
    }

    // Filter by status
    if (status) {
      query.accountStatus = status;
    }

    // Search by name or phone
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search } },
      ];
    }

    // Tìm danh sách users theo query
    const users = await Users.find(query)
      .populate({
        path: "rescueTeamId",
      })
      .sort({ createdAt: -1 });

    // Lấy danh sách userIds từ users
    const userIds = users.map((user) => user._id);

    // Tìm userRoles dựa trên userIds
    const userRoles = await UserRoles.find({
      userId: { $in: userIds },
    }).populate("roleId");

    // Map userRoles vào từng user
    const usersWithRoles = users.map((user) => {
      const rolesForUser = userRoles.filter(
        (ur) => ur.userId.toString() === user._id.toString()
      );
      return {
        ...user.toObject(),
        roles: rolesForUser,
      };
    });

    return ResponseStatus.ok(res, usersWithRoles);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Chi tiết user
export const getUserByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await Users.findById(id).populate({
      path: "rescueTeamId",
      select: "teamName",
    });

    if (!user) {
      return ResponseStatus.notfound(res);
    }

    // Lấy roles của user
    const userRoles = await UserRoles.find({ userId: id }).populate("roleId");

    return ResponseStatus.ok(res, {
      ...user.toObject(),
      roles: userRoles,
    });
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};
// Chi tiết user by phone number
export const getUserByPhoneNumber = async (req, res) => {
  try {
    const { phoneNumber } = req.params;

    const user = await Users.findOne({ phone: phoneNumber }).populate({
      path: "rescueTeamId",
      select: "teamName",
    });

    if (!user) {
      return ResponseStatus.ok(res, { exist: false });
    }

    // Lấy roles ĐÃ ACCEPT của user
    const userRoles = await UserRoles.find({
      userId: user._id,
      status: "accept",
    })
      .populate("roleId")
      .sort({ createdAt: -1 });

    return ResponseStatus.ok(res, {
      ...user.toObject(),
      roles: userRoles,
      exist: true,
    });
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Chi tiết user by firebase uid
export const getUserByUidFirebaseController = async (req, res) => {
  try {
    const { uid } = req.params;

    const user = await Users.findOne({ uid_firebase: uid }).populate({
      path: "rescueTeamId",
    });

    if (!user) {
      return ResponseStatus.notfound(res);
    }

    // Lấy roles ĐÃ ACCEPT của user
    const userRoles = await UserRoles.find({
      userId: user._id,
      status: "accept",
    })
      .populate("roleId")
      .sort({ createdAt: -1 });

    return ResponseStatus.ok(res, {
      ...user.toObject(),
      roles: userRoles,
    });
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Tạo user mới
export const createUserController = async (req, res) => {
  try {
    const userData = req.body;

    // Tạo user với trạng thái inactive
    const newUser = await Users.create({
      ...userData,
      // accountStatus: "inactive",
    });

    // Thêm roles cho user nếu có --> sai, phải lưu vào bảng role riêng
    // if (roles && roles.length > 0) {
    //   await UserRoles.insertMany(
    //     roles.map((roleId) => ({
    //       userId: newUser._id,
    //       roleId,
    //     }))
    //   );
    // }

    // Tạo lịch sử
    await StatusHistory.create({
      referenceTable: "Users",
      referenceId: newUser._id,
      action: "create",
      newStatus: "inactive",
      changedBy: req.user?._id || "676452c5b85460f14f0b1d76",
    });

    const result = {
      data: newUser,
      message: "Tạo người dùng thành công",
    };

    return ResponseStatus.created(res, result);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Cập nhật user
export const updateUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await Users.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return ResponseStatus.notfound(res);
    }

    const result = {
      data: updated,
      message: "Chỉnh sửa thông tin người dùng thành công",
    };

    return ResponseStatus.ok(res, result);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Toggle status user (active/inactive)
export const toggleUserStatusController = async (req, res) => {
  try {
    const { id } = req.body;

    const user = await Users.findById(id);
    if (!user) {
      return ResponseStatus.notfound(res);
    }

    const oldStatus = user.accountStatus;
    const newStatus = oldStatus === "active" ? "inactive" : "active";

    user.accountStatus = newStatus;
    await user.save();

    // Tạo lịch sử
    await StatusHistory.create({
      referenceTable: "Users",
      referenceId: id,
      action: "toggle_status",
      oldStatus,
      newStatus,
      changedBy: req.user?._id || "676452c5b85460f14f0b1d76",
    });

    const result = {
      data: user,
      message: "Chỉnh sửa trạng thái người dùng thành công",
    };

    return ResponseStatus.ok(res, result);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};
