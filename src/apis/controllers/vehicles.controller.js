import ResponseStatus from "../../response-handler/response-handler.js";
import Vehicles from "../../databases/models/vehicles.model.js";
import RescueTeams from "../../databases/models/rescue-teams.model.js";
import StatusHistory from "../../databases/models/status-history.model.js";

// Lấy danh sách phương tiện
export const getVehiclesController = async (req, res) => {
  try {
    const { status, type } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }
    if (type) {
      query.vehicleType = type;
    }

    const vehicles = await Vehicles.find(query)
      .populate("ownerId", "name phone")
      .populate("rescueTeamId", "teamName")
      .sort({ createdAt: -1 });

    return ResponseStatus.ok(res, vehicles);
  } catch (error) {
    return ResponseStatus.error(res);
  }
};

// Chi tiết phương tiện
export const getVehicleByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicles.findById(id)
      .populate("ownerId", "name phone")
      .populate("rescueTeamId", "teamName");

    if (!vehicle) {
      return ResponseStatus.notfound(res);
    }

    return ResponseStatus.ok(res, vehicle);
  } catch (error) {
    return ResponseStatus.error(res);
  }
};

// Đăng ký phương tiện
export const createVehicleController = async (req, res) => {
  try {
    const { rescueTeamId, ...vehicleData } = req.body;

    // Kiểm tra rescue team nếu có
    if (rescueTeamId) {
      const team = await RescueTeams.findById(rescueTeamId);
      if (!team) {
        return ResponseStatus.badRequest(res, "Đội cứu trợ không tồn tại");
      }
    }

    const newVehicle = await Vehicles.create({
      ...vehicleData,
      ownerId: req.user._id,
      rescueTeamId,
      status: "available",
    });

    // Tạo lịch sử
    await StatusHistory.create({
      referenceTable: "Vehicles",
      referenceId: newVehicle._id,
      action: "create",
      newStatus: "available",
      changedBy: req.user._id,
    });

    return ResponseStatus.created(res, newVehicle);
  } catch (error) {
    return ResponseStatus.error(res);
  }
};

// Cập nhật thông tin phương tiện
export const updateVehicleController = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Kiểm tra quyền cập nhật (chỉ owner hoặc team leader)
    const vehicle = await Vehicles.findById(id);
    if (!vehicle) {
      return ResponseStatus.notfound(res);
    }

    if (
      vehicle.ownerId.toString() !== req.user._id &&
      (!req.user.rescueTeamId ||
        vehicle.rescueTeamId.toString() !== req.user.rescueTeamId)
    ) {
      return ResponseStatus.forbidden(res, "Không có quyền cập nhật");
    }

    const updated = await Vehicles.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    return ResponseStatus.ok(res, updated);
  } catch (error) {
    return ResponseStatus.error(res);
  }
};

// Xóa phương tiện
export const deleteVehicleController = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra quyền xóa (chỉ owner)
    const vehicle = await Vehicles.findById(id);
    if (!vehicle) {
      return ResponseStatus.notfound(res);
    }

    if (vehicle.ownerId.toString() !== req.user._id) {
      return ResponseStatus.forbidden(res, "Không có quyền xóa");
    }

    // Kiểm tra phương tiện có đang được sử dụng
    if (vehicle.status === "in_use") {
      return ResponseStatus.badRequest(
        res,
        "Không thể xóa phương tiện đang được sử dụng"
      );
    }

    await vehicle.delete();

    // Tạo lịch sử
    await StatusHistory.create({
      referenceTable: "Vehicles",
      referenceId: id,
      action: "delete",
      oldStatus: vehicle.status,
      changedBy: req.user._id,
    });

    return ResponseStatus.ok(res, "Xóa phương tiện thành công");
  } catch (error) {
    return ResponseStatus.error(res);
  }
};
