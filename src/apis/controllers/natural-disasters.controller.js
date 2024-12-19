import ResponseStatus from "@/response-handler/response-handler.js";
import NaturalDisasters from "@/databases/models/natural-disasters.model.js";

// Lấy danh sách đợt thiên tai
export const getDisastersController = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }

    if (startDate && endDate) {
      query.startTime = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const disasters = await NaturalDisasters.find(query)
      .sort({ createdAt: -1 });

    return ResponseStatus.ok(res, disasters);
  } catch (error) {
    return ResponseStatus.error(res);
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
    return ResponseStatus.error(res);
  }
};

// Tạo đợt thiên tai mới
export const createDisasterController = async (req, res) => {
  try {
    const data = req.body;

    const newDisaster = await NaturalDisasters.create(data);

    return ResponseStatus.created(res, newDisaster);
  } catch (error) {
    return ResponseStatus.error(res);
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

    return ResponseStatus.ok(res, updated);
  } catch (error) {
    return ResponseStatus.error(res);
  }
};

// Xóa đợt thiên tai (soft delete)
export const deleteDisasterController = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await NaturalDisasters.findByIdAndUpdate(
      id,
      { $set: { deleted: true }},
      { new: true }
    );

    if (!deleted) {
      return ResponseStatus.notfound(res);
    }

    return ResponseStatus.ok(res, "Xóa thành công");
  } catch (error) {
    return ResponseStatus.error(res);
  }
};

// Lấy đợt thiên tai đang diễn ra
export const getActiveDisastersController = async (req, res) => {
  try {
    const activeDisasters = await NaturalDisasters.find({
      status: "ongoing",
      deleted: { $ne: true }
    });

    return ResponseStatus.ok(res, activeDisasters);
  } catch (error) {
    return ResponseStatus.error(res);
  }
};