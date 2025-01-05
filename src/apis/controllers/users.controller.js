import StatusHistory from "../../databases/models/status-history.model.js";
import UserRoles from "../../databases/models/user-roles.model.js";
import Users from "../../databases/models/users.model.js";
import ResponseStatus from "../../response-handler/response-handler.js";

// Lấy danh sách TNV
export const getUsersByRoleIdController = async (req, res) => {
  try {
    const { roleId } = req.query;

    const users = await Users.find({});

    return ResponseStatus.ok(res, users);
  } catch (error) {
    console.log(error);
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

    const users = await Users.find(query)
      .populate({
        path: "rescueTeamId",
        select: "teamName",
      })
      .sort({ createdAt: -1 });

    return ResponseStatus.ok(res, users);
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
    const userRoles = await UserRoles.find({ userId: id }).populate(
      "roleId",
      "name code"
    );

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
    console.log("\n🔥 ~ file: users.controller.js:81 ~ phone::\n", phoneNumber);

    const user = await Users.findOne({ phone: phoneNumber }).populate({
      path: "rescueTeamId",
      select: "teamName",
    });

    if (!user) {
      return ResponseStatus.ok(res, { exist: false });
    }

    // Lấy roles của user
    const userRoles = await UserRoles.find({ userId: user._id }).populate(
      "roleId",
      "name code"
    );

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
      select: "teamName",
    });
    console.log("\n🔥 ~ file: users.controller.js:85 ~ user::\n", user);

    if (!user) {
      return ResponseStatus.notfound(res);
    }

    // Lấy roles của user
    const userRoles = await UserRoles.find({
      userId: user._id,
      // status: "accept",
    }).populate("roleId", "name code");

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
    const { roles, ...userData } = req.body;

    // Tạo user với trạng thái inactive
    const newUser = await Users.create({
      ...userData,
      // accountStatus: "inactive",
    });

    // Thêm roles cho user nếu có
    if (roles && roles.length > 0) {
      await UserRoles.insertMany(
        roles.map((roleId) => ({
          userId: newUser._id,
          roleId,
        }))
      );
    }

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
