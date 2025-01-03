import ResponseStatus from "../../response-handler/response-handler.js";
import Roles from "../../databases/models/roles.model.js";
import UserRoles from "../../databases/models/user-roles.model.js";
// import BorrowVehices from "../../databases/models/borrow-vehicles.model.js"
//import tạm ở đây để khi chạy file, nó tạo luôn model BorrowVehices trong monggodb

// Lấy danh sách roles
export const getRolesController = async (req, res) => {
  try {
    const roles = await Roles.find().sort({ code: 1 });

    return ResponseStatus.ok(res, roles);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Chi tiết role
export const getRoleByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Roles.findById(id);
    if (!role) {
      return ResponseStatus.notfound(res);
    }

    return ResponseStatus.ok(res, role);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Tạo role mới
export const createRoleController = async (req, res) => {
  try {
    const data = req.body;

    // const newRole = await Roles.create(data);

    const newRole = await Roles.insertMany(data);

    const result = {
      data: newRole,
      message: "Role created successfully",
    };

    return ResponseStatus.created(res, result);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Cập nhật role
export const updateRoleController = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await Roles.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return ResponseStatus.notfound(res);
    }

    const result = {
      data: updated,
      message: "Chỉnh sửa role thành công",
    };

    return ResponseStatus.ok(res, result);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Xóa role và cập nhật user_roles
export const deleteRoleController = async (req, res) => {
  try {
    const { id } = req.params;

    // Xóa role
    const deleted = await Roles.findByIdAndDelete(id);
    if (!deleted) {
      return ResponseStatus.notfound(res);
    }

    // Xóa trong bảng user_role
    await UserRoles.deleteMany({ roleId: id });

    // Cập nhật role của các user
    const affectedUsers = await UserRoles.find({ roleId: id });
    for (const userRole of affectedUsers) {
      const remainingRoles = await UserRoles.find({ userId: userRole.userId });
      // TODO: Cập nhật role array của user
    }
    const result = {
      message: "Xóa role thành công",
    };

    return ResponseStatus.ok(res, result);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};
