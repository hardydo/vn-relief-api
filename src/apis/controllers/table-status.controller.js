import ResponseStatus from "../../response-handler/response-handler.js";
import TableStatuses from "../../databases/models/table-status.model.js";

// Lấy tất cả trạng thái bảng
export const getAllTableStatusController = async (req, res) => {
  try {
    const statuses = await TableStatuses.find().sort({
      referenceTable: 1,
      status: 1,
    });

    return ResponseStatus.ok(res, statuses);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Lấy ra các trạng thái của bảng
export const getTableStatusController = async (req, res) => {
  try {
    const { table } = req.params;

    const statuses = await TableStatuses.find({ referenceTable: table }).sort({
      status: 1,
    });

    return ResponseStatus.ok(res, statuses);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Tạo mới trạng thái
export const createTableStatusController = async (req, res) => {
  try {
    const data = req.body;

    const newStatus = await TableStatuses.create(data);
    const result = {
      data: newStatus,
      message: "Lưu lịch sử trạng thái thành công"
    }
    return ResponseStatus.created(res, result);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Cập nhật trạng thái
export const updateTableStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await TableStatuses.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return ResponseStatus.notfound(res);
    }
    const result = {
      data: updated,
      message: "Cập nhật lịch sử trạng thái thành công"
    }
    return ResponseStatus.ok(res, result);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Xóa trạng thái
export const deleteTableStatusController = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await TableStatuses.findByIdAndDelete(id);

    if (!deleted) {
      return ResponseStatus.notfound(res);
    }

    return ResponseStatus.ok(res, {message: "Xóa trạng thái thành công"});
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};
