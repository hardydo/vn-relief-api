import ResponseStatus from "../../response-handler/response-handler.js";
import Vehicles from "../../databases/models/vehicles.model.js";
import RescueTeams from "../../databases/models/rescue-teams.model.js";
import StatusHistory from "../../databases/models/status-history.model.js";
import BorrowVehicles from "../../databases/models/borrow-vehicles.model.js";

// Lấy danh sách phương tiện
/**
 * @type: "userId" --> lấy danh sách phương tiện của userId
 * @type: "all" --> lấy hết
 */
export const getVehiclesController = async (req, res) => {
  try {
    const { type } = req.query;

    let query = {};
    if (type !== "all") query.ownerId = type;

    const vehicles = await Vehicles.find(query)
      .populate("ownerId")
      .populate("rescueTeamId")
      .sort({ createdAt: -1 });

    return ResponseStatus.ok(res, vehicles);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Chi tiết phương tiện
export const getVehicleByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const [vehicle, borrowRequests] = await Promise.all([
      Vehicles.findById(id).populate("ownerId").populate("rescueTeamId"),
      BorrowVehicles.find({ lenderId: id })
        .populate("userId")
        .populate("rescueTeamId")
        .sort({ createdAt: -1 }),
    ]);

    if (!vehicle) {
      return ResponseStatus.notfound(res);
    }

    return ResponseStatus.ok(res, {
      ...vehicle.toObject(),
      borrowRequests,
    });
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
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
      rescueTeamId,
      status: "available",
    });

    // Tạo lịch sử
    await StatusHistory.create({
      referenceTable: "Vehicles",
      referenceId: newVehicle._id,
      action: "create",
      newStatus: "available",
      changedBy: req.user?._id || "676452c5b85460f14f0b1d76",
    });
    const result = {
      message: "Tạo phương tiện thành công",
      data: newVehicle,
    };

    return ResponseStatus.created(res, result);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
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
      vehicle.ownerId.toString() !==
        (req.user?._id || "676452c5b85460f14f0b1d76") &&
      (!req.user.rescueTeamId ||
        vehicle.rescueTeamId?.toString() !== req.user?.rescueTeamId)
    ) {
      return ResponseStatus.forbidden(res, "Không có quyền cập nhật");
    }

    const updated = await Vehicles.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    const result = {
      message: "Cập nhật phương tiện thành công",
      data: updated,
    };

    return ResponseStatus.ok(res, result);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
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

    if (
      vehicle.ownerId.toString() !==
      (req.user?._id || "676452c5b85460f14f0b1d76")
    ) {
      return ResponseStatus.forbidden(res, "Không có quyền xóa");
    }

    // Kiểm tra phương tiện có đang được sử dụng
    if (vehicle.status === "in_use") {
      return ResponseStatus.badRequest(
        res,
        "Không thể xóa phương tiện đang được sử dụng"
      );
    }

    await Vehicles.deleteMany({ id });

    // Tạo lịch sử
    await StatusHistory.create({
      referenceTable: "Vehicles",
      referenceId: id,
      action: "delete",
      oldStatus: vehicle.status,
      changedBy: req.user?._id || "676452c5b85460f14f0b1d76",
    });

    return ResponseStatus.ok(res, { message: "Xóa phương tiện thành công" });
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};
