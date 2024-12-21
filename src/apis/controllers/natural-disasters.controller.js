import ResponseStatus from "../../response-handler/response-handler.js";
import NaturalDisasters from "../../databases/models/natural-disasters.model.js";
import { DateTime } from "luxon";


// Lấy danh sách đợt thiên tai
export const getDisastersController = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }

    const parseDate = (date) =>
      DateTime.fromISO(date, { zone: "Asia/Ho_Chi_Minh" });
    if (startDate || endDate) {
      if (startDate) {
        query.startTime = {};
        const start = parseDate(startDate);
        if (start.isValid) {
          query.startTime.$gte = start.toJSDate();
        } else {
          return ResponseStatus.badRequest(res, "startDate sai định dạng" );
        }
      }
      if (endDate) {
        query.endTime = {};
        const end = parseDate(endDate);
        if (end.isValid) {
          query.endTime.$gte = end.toJSDate();
        } else {
           return ResponseStatus.badRequest(res, "endDate sai định dạng");
        }
      }
    }

    const disasters = await NaturalDisasters.find(query).sort({
      createdAt: -1,
    });

    return ResponseStatus.ok(res, disasters);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Chi tiết đợt thiên tai
export const getDisasterByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const disaster = await NaturalDisasters.findById(id);
    if (!disaster) {
      return ResponseStatus.notfound(res);
    }

    return ResponseStatus.ok(res, disaster);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Tạo đợt thiên tai mới
export const createDisasterController = async (req, res) => {
  try {
    const data = req.body;

    const newDisaster = await NaturalDisasters.create(data);
    const result = {
      data: newDisaster,
      message: "Tạo thiên tai mới thành công"
    }
    return ResponseStatus.created(res, result);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Cập nhật đợt thiên tai
export const updateDisasterController = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await NaturalDisasters.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return ResponseStatus.notfound(res);
    }
    const result = {
      data: updated,
      message: "Tạo thiên tai mới thành công",
    };
    return ResponseStatus.ok(res, result);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Xóa đợt thiên tai (soft delete)
export const deleteDisasterController = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await NaturalDisasters.findByIdAndUpdate(
      id,
      { $set: { deleted: true } },
      { new: true }
    );

    if (!deleted) {
      return ResponseStatus.notfound(res);
    }

    return ResponseStatus.ok(res, {message: "Xóa thành công"});
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Lấy đợt thiên tai đang diễn ra
export const getActiveDisastersController = async (req, res) => {
  try {
    const activeDisasters = await NaturalDisasters.find({
      status: "ongoing",
      deleted: { $ne: true },
    });

    return ResponseStatus.ok(res, activeDisasters);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};
