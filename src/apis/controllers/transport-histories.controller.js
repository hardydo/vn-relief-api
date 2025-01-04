import ResponseStatus from "../../response-handler/response-handler.js";
import TransportHistories from "../../databases/models/transport-histories.model.js";
import Transports from "../../databases/models/transports.model.js";
import StatusHistory from "../../databases/models/status-history.model.js";
import Vehicles from "../../databases/models/vehicles.model.js";

// Lấy lịch sử vận chuyển
export const getTransportHistoriesController = async (req, res) => {
  try {
    const { id } = req.params; // transport id

    const histories = await TransportHistories.find({ transportId: id }).sort({
      createdAt: -1,
    });

    return ResponseStatus.ok(res, histories);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Thêm điểm check-in mới (liên kết với vehicles nhá)
export const addCheckpointController = async (req, res) => {
  try {
    const { id } = req.params; //id của vehicles
    const { location, status, notes } = req.body;

    // Kiểm tra transport tồn tại
    const vehicle = await Vehicles.findById(id);
    if (!vehicle) {
      return ResponseStatus.notfound(res);
    }

    const newCheckpoint = await TransportHistories.create({
      vehicleId: id,
      location,
      status,
      notes,
    });

    // Tạo lịch sử
    await StatusHistory.create({
      referenceTable: "TransportHistories",
      referenceId: newCheckpoint._id,
      action: "checkpoint",
      newStatus: status,
      changedBy: req.user?._id || "676452c5b85460f14f0b1d76",
      description: notes,
    });

    const result = {
      message: "Tạo địa điểm check-in thành công",
      data: newCheckpoint,
    };

    return ResponseStatus.created(res, result);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Cập nhật trạng thái checkpoint
export const updateCheckpointStatusController = async (req, res) => {
  try {
    const { id, historyId } = req.params;
    const { status, notes } = req.body;

    const checkpoint = await TransportHistories.findById(historyId);
    if (!checkpoint) {
      return ResponseStatus.notfound(res);
    }

    const oldStatus = checkpoint.status;

    // Cập nhật trạng thái
    checkpoint.status = status;
    if (notes) {
      checkpoint.notes = notes;
    }
    await checkpoint.save();

    // Tạo lịch sử
    await StatusHistory.create({
      referenceTable: "TransportHistories",
      referenceId: historyId,
      action: "update_status",
      oldStatus,
      newStatus: status,
      changedBy: req.user?._id || "676452c5b85460f14f0b1d76",
      description: notes,
    });
    const result = {
      data: checkpoint,
      message: "Cập nhật trạng thái thành công",
    };
    return ResponseStatus.ok(res, result);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};
