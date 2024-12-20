import ResponseStatus from "../../response-handler/response-handler.js";
import StatusHistory from "../../databases/models/status-history.model.js";

// Lấy tất cả lịch sử
export const getAllHistoriesController = async (req, res) => {
  try {
    const histories = await StatusHistory.find()
      .populate("changedBy", "name")
      .sort({ createdAt: -1 });

    return ResponseStatus.ok(res, histories);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Lấy lịch sử của một record
export const getStatusHistoryController = async (req, res) => {
  try {
    const { table, id } = req.params;

    const histories = await StatusHistory.find({
      referenceTable: table,
      referenceId: id,
    })
      .populate("changedBy", "name")
      .sort({ createdAt: -1 });

    return ResponseStatus.ok(res, histories);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Tạo mới lịch sử
export const createHistoryController = async (req, res) => {
  try {
    const data = req.body;

    const newHistory = await StatusHistory.create({
      ...data,
      changedBy: req.user?._id,
    });

    return ResponseStatus.created(res, newHistory);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Cập nhật lịch sử
export const updateHistoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await StatusHistory.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return ResponseStatus.notfound(res);
    }

    return ResponseStatus.ok(res, updated);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Xóa lịch sử
export const deleteHistoryController = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await StatusHistory.findByIdAndDelete(id);

    if (!deleted) {
      return ResponseStatus.notfound(res);
    }

    return ResponseStatus.ok(res, "Xóa lịch sử thành công");
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};
