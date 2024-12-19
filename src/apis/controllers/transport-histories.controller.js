import ResponseStatus from "@/response-handler/response-handler.js";
import TransportHistories from "@/databases/models/transport-histories.model.js";
import Transports from "@/databases/models/transports.model.js";
import StatusHistory from "@/databases/models/status-history.model.js";

// Lấy lịch sử vận chuyển
export const getTransportHistoriesController = async (req, res) => {
  try {
    const { id } = req.params; // transport id

    const histories = await TransportHistories.find({ transportId: id })
      .sort({ createdAt: -1 });

    return ResponseStatus.ok(res, histories);
  } catch (error) {
    return ResponseStatus.error(res);
  }
};

// Thêm điểm check-in mới
export const addCheckpointController = async (req, res) => {
  try {
    const { id } = req.params;
    const { location, status, notes } = req.body;

    // Kiểm tra transport tồn tại
    const transport = await Transports.findById(id);
    if (!transport) {
      return ResponseStatus.notfound(res);
    }

    const newCheckpoint = await TransportHistories.create({
      transportId: id,
      location,
      status,
      notes
    });

    // Tạo lịch sử
    await StatusHistory.create({
      referenceTable: 'TransportHistories',
      referenceId: newCheckpoint._id,
      action: 'checkpoint',
      newStatus: status,
      changedBy: req.user._id,
      description: notes
    });

    return ResponseStatus.created(res, newCheckpoint);
  } catch (error) {
    return ResponseStatus.error(res);
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
      referenceTable: 'TransportHistories',
      referenceId: historyId,
      action: 'update_status',
      oldStatus,
      newStatus: status,
      changedBy: req.user._id,
      description: notes
    });

    return ResponseStatus.ok(res, checkpoint);
  } catch (error) {
    return ResponseStatus.error(res);
  }
};