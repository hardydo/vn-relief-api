import ResponseStatus from "../../response-handler/response-handler.js";
import SupportLocations from "../../databases/models/support-locations.model.js";
import ContributionDetails from "../../databases/models/contribution-details.model.js";
import Transports from "../../databases/models/transports.model.js";
import ReliefContributions from "../../databases/models/relief-contributions.model.js";

// Lấy danh sách địa điểm mà phương tiện đã nhận hàng
export const getSupportLocationsReveicedController = async (req, res) => {
  try {
    const { vehicleId } = req.params; //userId hoặc all

    // Trước tiên lấy ra tất cả transport của vehicle
    const transports = await Transports.find({
      vehicleId: vehicleId,
    });

    // Lấy ra các pickupLocationId unique
    const locationIds = [...new Set(transports.map((t) => t.pickupLocationId))];

    // Query các SupportLocation tương ứng
    const locations = await SupportLocations.find({
      _id: { $in: locationIds },
    });

    return ResponseStatus.ok(res, locations);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Lấy danh sách địa điểm theo user/all (kèm thông tin hàng hóa)
export const getSupportLocationsController = async (req, res) => {
  try {
    const { type } = req.query;
    const { from } = req.params; //userId hoặc all

    let query = {};
    if (type && type !== "all") {
      query.locationType = type;
    }

    const pipeline = [
      { $match: query },
      {
        $lookup: {
          from: "reliefcontributions",
          let: { locationId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$supportLocationId", "$$locationId"] },
              },
            },
            {
              $lookup: {
                from: "contributiondetails",
                localField: "_id",
                foreignField: "reliefContributionId",
                as: "contributionDetails",
              },
            },
            {
              $unwind: "$contributionDetails",
            },
            {
              $replaceRoot: {
                newRoot: "$contributionDetails",
              },
            },
          ],
          as: "supplies",
        },
      },
      {
        $lookup: {
          from: "users", // Tên collection chứa thông tin user
          localField: "userId", // Field trong `SupportLocations` hoặc các document liên quan
          foreignField: "_id", // Field `_id` của user trong collection `users`
          as: "user", // Tên field mới chứa thông tin user
        },
      },
      {
        $unwind: {
          path: "$user", // Bóc tách thông tin user
          preserveNullAndEmptyArrays: true, // Nếu không tìm thấy user, giữ nguyên document
        },
      },
    ];

    const locations = await SupportLocations.aggregate(pipeline).sort({
      createdAt: -1,
    });

    return ResponseStatus.ok(res, locations);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Lấy danh sách địa điểm theo type (kèm thông tin hàng hóa)
export const getLocationsByTypeController = async (req, res) => {
  try {
    const { type, area } = req.query;
    const naturalDisasterId = req.headers["naturaldisasterid"];

    // Query SupportLocations first
    let query = {};

    if (type && type !== "all") {
      query.locationType = type;
    }

    if (area) {
      query.wardCode = area;
    }

    if (naturalDisasterId) {
      query.naturalDisasterId = naturalDisasterId;
    }

    // Get all locations first
    const locations = await SupportLocations.find(query)
      .populate({
        path: "userId",
      })
      .lean();

    // Get all ReliefContributions and their details for each location
    const locationsWithSupplies = await Promise.all(
      locations.map(async (location) => {
        // First get all relief contributions for this location
        const contributions = await ReliefContributions.find({
          supportLocationId: location._id,
        }).lean();

        // Get all contributionDetails for these contributions
        const contributionIds = contributions.map((contrib) => contrib._id);

        const supplies = await ContributionDetails.find({
          reliefContributionId: { $in: contributionIds },
        }).lean();

        // Map supplies with their contribution info
        const suppliesWithContributorInfo = supplies.map((supply) => {
          const contribution = contributions.find(
            (c) => c._id.toString() === supply.reliefContributionId.toString()
          );

          return {
            _id: supply._id,
            name: supply.name,
            unit: supply.unit,
            providedQuantity: supply.providedQuantity,
            remainingQuantity: supply.remainingQuantity,
            createdAt: supply.createdAt,
            contributor: contribution, // Contains donorName, phone, etc from ReliefContributions
          };
        });

        return {
          ...location,
          supplies: suppliesWithContributorInfo,
        };
      })
    );

    return ResponseStatus.ok(res, locationsWithSupplies);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Chi tiết địa điểm
export const getSupportLocationByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    // Get location info
    const location = await SupportLocations.findById(id).populate("userId");
    if (!location) {
      return ResponseStatus.notfound(res);
    }

    // First get all relief contributions for this location
    const contributions = await ReliefContributions.find({
      supportLocationId: id,
    }).lean();

    // Get all contributionDetails for these contributions
    const contributionIds = contributions.map((contrib) => contrib._id);

    const supplies = await ContributionDetails.find({
      reliefContributionId: { $in: contributionIds },
      remainingQuantity: { $gt: 0 },
    }).lean();

    // Map supplies with their contribution info
    const suppliesWithContributorInfo = supplies.map((supply) => {
      const contribution = contributions.find(
        (c) => c._id.toString() === supply.reliefContributionId.toString()
      );

      return {
        _id: supply._id,
        name: supply.name,
        unit: supply.unit,
        providedQuantity: supply.providedQuantity,
        remainingQuantity: supply.remainingQuantity,
        createdAt: supply.createdAt,
        contributor: contribution, // Contains donorName, phone, address etc from ReliefContributions
      };
    });

    return ResponseStatus.ok(res, {
      ...location.toObject(),
      supplies: suppliesWithContributorInfo,
    });
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Thêm địa điểm mới
export const createSupportLocationController = async (req, res) => {
  try {
    const { type } = req.params;
    const data = req.body;

    // Kiểm tra loại địa điểm hợp lệ
    const validTypes = [
      "temporary_stop",
      "residence",
      "warehouse",
      "commissariat",
    ];
    if (!validTypes.includes(type)) {
      return ResponseStatus.badRequest(res, "Loại địa điểm không hợp lệ");
    }

    const newLocation = await SupportLocations.create({
      ...data,
      locationType: type,
      // userId: req.user?._id,
      naturalDisasterId: req.headers["naturaldisasterid"],
    });

    const result = {
      message: "Thêm địa điểm hỗ trợ thành công",
      data: newLocation,
    };

    return ResponseStatus.created(res, result);
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

    const result = {
      message: "Cập nhật địa chỉ thành công",
      data: updated,
    };

    return ResponseStatus.ok(res, result);
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

    return ResponseStatus.ok(res, { message: "Xóa địa điểm thành công" });
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

    return ResponseStatus.ok(res, {
      messsage: "Tiếp nhận hàng hóa thành công",
    });
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Tìm địa điểm gần nhất
export const getNearbyLocationsController = async (req, res) => {
  try {
    const userWardCode = req.user?.wardCode || "01|23|34";
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
