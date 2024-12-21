import ResponseStatus from "../../response-handler/response-handler.js";
import DisasterInformation from "../../databases/models/disaster-information.model.js";
import NaturalDisasters from "../../databases/models/natural-disasters.model.js";

// Lấy danh sách thông tin thiên tai của 1 đợt
export const getDisasterInfoController = async (req, res) => {
  try {
    const { disasterId } = req.params;
    const { type, area, startDate, endDate } = req.query;

    let query = { naturalDisasterId: disasterId };

    if (area) {
      query.wardCode = area;
    }

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const disasterInfo = await DisasterInformation.find(query).sort({
      createdAt: -1,
    });

    return ResponseStatus.ok(res, disasterInfo);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Chi tiết một thông tin thiên tai
export const getDisasterInfoByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const info = await DisasterInformation.findById(id);
    if (!info) {
      return ResponseStatus.notfound(res);
    }

    return ResponseStatus.ok(res, info);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Thêm thông tin thiên tai mới
export const createDisasterInfoController = async (req, res) => {
  try {
    const { disasterId } = req.params;
    const data = req.body;

    // Kiểm tra đợt thiên tai tồn tại
    const disaster = await NaturalDisasters.findById(disasterId);
    if (!disaster) {
      return ResponseStatus.notfound(res);
    }

    const newInfo = await DisasterInformation.create({
      ...data,
      naturalDisasterId: disasterId,
      reporterId: req.user?._id,
    });
    const result = {
      message: "Tạo thông tin thiên tai mới thành công",
      data: newInfo
    }
    return ResponseStatus.created(res, result);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Cập nhật thông tin thiên tai
export const updateDisasterInfoController = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await DisasterInformation.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return ResponseStatus.notfound(res);
    }
    const result = {
      message: "Chỉnh sửa thông tin thiên tai thành công",
      data: updated,
    };
    return ResponseStatus.ok(res, result);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Xóa thông tin thiên tai
export const deleteDisasterInfoController = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await DisasterInformation.findByIdAndDelete(id);

    if (!deleted) {
      return ResponseStatus.notfound(res);
    }

    return ResponseStatus.ok(res, {message: "Xóa thành công"});
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};
