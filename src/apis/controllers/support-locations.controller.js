import ResponseStatus from "../../response-handler/response-handler.js";
import SupportLocations from "../../databases/models/support-locations.model.js";
import ContributionDetails from "../../databases/models/contribution-details.model.js";

// Lấy danh sách địa điểm (kèm thông tin hàng hóa)
export const getSupportLocationsController = async (req, res) => {
  try {
    const { type, area } = req.query;

    let query = {};
    if (type && type !== "all") {
      query.locationType = type;
    }
    if (area) {
      query.wardCode = area;
    }

    // Lấy địa điểm và join với thông tin hàng hóa
    const locations = await SupportLocations.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "contributiondetails",
          let: { locationId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$locationId", "$$locationId"] },
                remainingQuantity: { $gt: 0 },
              },
            },
          ],
          as: "supplies",
        },
      },
    ]).sort({ createdAt: -1 });

    return ResponseStatus.ok(res, locations);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Chi tiết địa điểm
export const getSupportLocationByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const location = await SupportLocations.findById(id);
    if (!location) {
      return ResponseStatus.notfound(res);
    }

    // Lấy thông tin hàng hóa tại địa điểm
    const supplies = await ContributionDetails.find({
      locationId: id,
      remainingQuantity: { $gt: 0 },
    });

    return ResponseStatus.ok(res, { ...location.toObject(), supplies });
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Thêm địa điểm mới
export const createSupportLocationController = async (req, res) => {
  try {
    const data = req.body;

    const newLocation = await SupportLocations.create({
      ...data,
      verificationOfficerId: req.user._id,
      verificationStatus: "active",
    });

    return ResponseStatus.created(res, newLocation);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Cập nhật thông tin địa điểm
export const updateSupportLocationController = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await SupportLocations.findByIdAndUpdate(
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

// Xóa địa điểm
export const deleteSupportLocationController = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra còn hàng hóa không
    const hasSupplies = await ContributionDetails.exists({
      locationId: id,
      remainingQuantity: { $gt: 0 },
    });

    if (hasSupplies) {
      return ResponseStatus.badRequest(
        res,
        "Không thể xóa địa điểm còn hàng hóa"
      );
    }

    const deleted = await SupportLocations.findByIdAndDelete(id);

    if (!deleted) {
      return ResponseStatus.notfound(res);
    }

    return ResponseStatus.ok(res, "Xóa địa điểm thành công");
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Tiếp nhận hàng hóa tại địa điểm
export const receiveSuppliesController = async (req, res) => {
  try {
    const { id } = req.params;
    const { items, vehicleId } = req.body;

    // Cập nhật trạng thái các item
    for (const itemId of items) {
      await ContributionDetails.findByIdAndUpdate(itemId, {
        $set: {
          status: "in_transit",
          locationId: id,
        },
      });
    }

    // TODO: Cập nhật lịch trình vận chuyển

    return ResponseStatus.ok(res, "Tiếp nhận hàng hóa thành công");
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Tìm địa điểm gần nhất
export const getNearbyLocationsController = async (req, res) => {
  try {
    const userWardCode = req.user?.wardCode;
    if (!userWardCode) {
      return ResponseStatus.badRequest(
        res,
        "Không có thông tin địa phương của người dùng"
      );
    }

    // Lọc địa điểm dựa trên mã địa phương
    const [ward, district, province] = userWardCode.split("|");

    const locations = await SupportLocations.find({
      wardCode: {
        $in: [userWardCode, `${ward}|${district}`, `${ward}`],
      },
    }).sort({ createdAt: -1 });

    return ResponseStatus.ok(res, locations);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};
