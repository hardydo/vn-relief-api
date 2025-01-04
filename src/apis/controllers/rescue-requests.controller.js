import ResponseStatus from "../../response-handler/response-handler.js";
import RescueRequests from "../../databases/models/rescue-requests.model.js";
import TeamRescueRequests from "../../databases/models/team-rescue-requests.model.js";
import StatusHistory from "../../databases/models/status-history.model.js";
import TransportSupplies from "../../databases/models/transport-supplies.model.js";
import FinancialTransactions from "../../databases/models/financial-transactions.model.js";
import RescueRequestItems from "../../databases/models/rescue-request-items.model.js";

// Lấy danh sách hỗ trợ cho 1 đơn rescuerequest
export const getReceivedRequestsController = async (req, res) => {
  try {
    const { rescueRequestId } = req.params;

    const [transportSupplies, userContributions] = await Promise.all([
      TransportSupplies.find({
        rescueRequestId,
      }).populate({
        path: "vehicleId",
        select: "_id name ownerId", // Chỉ lấy các trường cần thiết trong vehicleId
        populate: {
          path: "ownerId", // Tên field tham chiếu trong vehicleId
          select: "_id name phone", // Chỉ lấy các trường cần thiết trong userId
        },
      }),
      FinancialTransactions.find({
        rescueRequestId,
      }).populate("userId", "_id name"),
    ]);

    // Lấy danh sách tất cả các ObjectId từ field `amount` trong `transportSupplies` và `userContributions`
    const rescueRequestItemIds = new Set();

    transportSupplies.forEach((supply) => {
      Object.keys(supply.amount || {}).forEach((id) =>
        rescueRequestItemIds.add(id)
      );
    });

    userContributions.forEach((contribution) => {
      Object.keys(contribution.amount || {}).forEach((id) =>
        rescueRequestItemIds.add(id)
      );
    });

    // Tìm tất cả các `rescueRequestItems` tương ứng
    const rescueRequestItems = await RescueRequestItems.find({
      _id: { $in: Array.from(rescueRequestItemIds) },
    }).lean();

    // Tạo một map để truy xuất nhanh giá trị của `rescueRequestItems`
    const rescueRequestItemsMap = rescueRequestItems.reduce((map, item) => {
      map[item._id.toString()] = item;
      return map;
    }, {});

    // Gắn thông tin của `rescueRequestItems` vào `amount`
    const mapRescueItems = (amount) =>
      Object.entries(amount || {}).map(([id, value]) => ({
        item: rescueRequestItemsMap[id] || null,
        quantity: value,
      }));

    transportSupplies.forEach((supply) => {
      supply.amount = mapRescueItems(supply.amount);
    });

    userContributions.forEach((contribution) => {
      contribution.amount = mapRescueItems(contribution.amount);
    });
    return ResponseStatus.ok(res, {
      transportSupplies,
      userContributions,
    });
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Lấy danh sách yêu cầu cứu trợ
//http://localhost:8800/rescue-requests?type=emergency&area=9289|259|27&nearby=true
export const getRescueRequestsController = async (req, res) => {
  try {
    const { status, type, area, nearby } = req.query;
    const naturalDisasterId = req.headers["naturaldisasterid"];

    let query = {};
    query.naturalDisasterId = naturalDisasterId;

    if (status) {
      query.status = status;
    }
    if (type) {
      query.type = type;
    }
    if (area) {
      query.wardCode = area;
    }
    if (nearby === "true" && (req.user?.wardCode || " ")) {
      // Lọc yêu cầu gần người dùng dựa trên mã địa phương
      const wardCode = req.user?.wardCode || "01|23|34";
      const [userWard, userDistrict, userProvince] = wardCode.split("|");
      query.wardCode = {
        $in: [
          req.user?.wardCode || "01|23|34",
          `${userWard}|${userDistrict}`,
          `${userWard}`,
        ],
      };
    }

    const requests = await RescueRequests.find(query)
      .populate("informantId", "name phone")
      .sort({ createdAt: -1 });

    return ResponseStatus.ok(res, requests);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Chi tiết yêu cầu
export const getRescueRequestByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await RescueRequests.findById(id)
      .populate("informantId", "name phone")
      .populate("verifierId", "name phone");

    if (!request) {
      return ResponseStatus.notfound(res);
    }

    return ResponseStatus.ok(res, request);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Tạo yêu cầu mới
export const createRescueRequestController = async (req, res) => {
  try {
    const data = req.body;
    const naturalDisasterId = req.headers["naturaldisasterid"];

    const newRequest = await RescueRequests.create({
      ...data,
      naturalDisasterId,
      informantId: req.user?._id || null,
      status: {
        verify: "pending",
        recipient: "pending",
        goods: "pending",
      },
    });

    // Tạo lịch sử trạng thái
    await StatusHistory.create({
      referenceTable: "RescueRequests",
      referenceId: newRequest._id,
      action: "create",
      status: {
        verify: "pending",
        recipient: "pending",
        goods: "pending",
      },
      changedBy: req.user?._id || null,
    });
    const result = {
      data: newRequest,
      message: "Tạo yêu cầu hỗ trợ thành công",
    };
    return ResponseStatus.created(res, result);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Cập nhật yêu cầu (chỉ được cập nhật trước khi có đội nhận)
export const updateRescueRequestController = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Kiểm tra có đội nào nhận chưa
    const assignedTeam = await TeamRescueRequests.findOne({
      rescueRequestId: id,
    });
    if (assignedTeam) {
      return ResponseStatus.forbidden(
        res,
        "Không thể cập nhật khi đã có đội nhận"
      );
    }

    const updated = await RescueRequests.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return ResponseStatus.notfound(res);
    }
    const result = {
      message: "Cập nhật thông tin cứu trợ thành công",
      data: updated,
    };
    return ResponseStatus.ok(res, result);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Xóa yêu cầu (chỉ được xóa khi chưa có đội nhận)
export const deleteRescueRequestController = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra có đội nào nhận chưa
    const assignedTeam = await TeamRescueRequests.findOne({
      rescueRequestId: id,
    });
    if (assignedTeam) {
      return ResponseStatus.forbidden(res, "Không thể xóa khi đã có đội nhận");
    }

    const deleted = await RescueRequests.findByIdAndDelete(id);

    if (!deleted) {
      return ResponseStatus.notfound(res);
    }

    return ResponseStatus.ok(res, { message: "Xóa thành công" });
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Xác minh yêu cầu (TNV xác minh)
export const verifyRescueRequestController = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(
      "\n🔥 ~ file: rescue-requests.controller.js:173 ~ req.body?.verifierId::\n",
      req.body?.verifierId
    );

    const updated = await RescueRequests.findByIdAndUpdate(
      id,
      {
        $set: {
          verifierId: req.body?.verifierId || "676452c5b85460f14f0b1d76",
          status: "verified",
        },
      },
      { new: true }
    );

    if (!updated) {
      return ResponseStatus.notfound(res);
    }

    // Tạo lịch sử trạng thái
    await StatusHistory.create({
      referenceTable: "RescueRequests",
      referenceId: id,
      action: "verify",
      oldStatus: "pending",
      newStatus: "verified",
      changedBy: req.user?._id || "676452c5b85460f14f0b1d76",
    });

    return ResponseStatus.ok(res, updated);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Cập nhật trạng thái (chỉ đội cứu trợ)
export const updateStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    console.log("🚀 ~ updateStatusController ~ id:", id);

    // Kiểm tra yêu cầu được gán cho đội của user
    const teamRequest = await TeamRescueRequests.findOne({
      rescueRequestId: id,
      rescueTeamId: req.user?.rescueTeamId || "67659c92b213f000bbe0f102",
    });

    if (!teamRequest) {
      return ResponseStatus.forbidden(res, "Không có quyền cập nhật");
    }

    const oldStatus = teamRequest.status;
    teamRequest.status = status;
    await teamRequest.save();

    // Tạo lịch sử trạng thái
    await StatusHistory.create({
      referenceTable: "TeamRescueRequests",
      referenceId: teamRequest._id,
      action: "update_status",
      oldStatus,
      newStatus: status,
      changedBy: req.user?._id || "676452c5b85460f14f0b1d76",
    });
    const result = {
      messsage: "Cập nhật trạng thái thành công",
      data: teamRequest,
    };
    return ResponseStatus.ok(res, result);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Phân công cho đội (TNV role xác minh)
export const assignTeamController = async (req, res) => {
  try {
    const { id, teamId } = req.params;

    const newAssignment = await TeamRescueRequests.create({
      rescueRequestId: id,
      rescueTeamId: teamId,
      status: "pending",
    });

    // Cập nhật trạng thái yêu cầu
    await RescueRequests.findByIdAndUpdate(id, {
      $set: { status: "assigned" },
    });

    // Tạo lịch sử trạng thái
    await StatusHistory.create({
      referenceTable: "RescueRequests",
      referenceId: id,
      action: "assign",
      oldStatus: "verified",
      newStatus: "assigned",
      changedBy: req.user?._id || "676452c5b85460f14f0b1d76",
      description: `Assigned to team ${teamId}`,
    });

    const result = {
      message: "Giao việc cho đội thành công",
      data: newAssignment,
    };

    return ResponseStatus.created(res, result);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};
