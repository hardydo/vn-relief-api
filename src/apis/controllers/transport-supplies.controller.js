import ResponseStatus from "../../response-handler/response-handler.js";
import TransportSupplies from "../../databases/models/transport-supplies.model.js";
import ContributionDetails from "../../databases/models/contribution-details.model.js";
import StatusHistory from "../../databases/models/status-history.model.js";

// Kiểm tra xem phương tiện đã nhận đơn cứu trợ hay chưa
export const handleCheckExistVehicleReceiveRescueRequest = async (req, res) => {
  try {
    const { vehicleId, rescueRequestId } = req.body;
    const supplies = await TransportSupplies.find({
      vehicleId,
      rescueRequestId,
    });

    return ResponseStatus.ok(res, supplies);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Nhận đơn cứu trợ từ điểm tập kết
export const handleReceiveGoodsFromSupportLocation = async (req, res) => {
  try {
    const supplies = await TransportSupplies.create(req.body);

    return ResponseStatus.ok(res, supplies);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

//============== a Lộc hiểu sai ý, nên các cái dưới coi như bỏ
// Lấy danh sách hàng đang vận chuyển
export const getTransportSuppliesController = async (req, res) => {
  try {
    const { id } = req.params; // transport id

    const supplies = await TransportSupplies.find({ transportId: id })
      .populate("rescueRequestId")
      .sort({ createdAt: -1 });

    return ResponseStatus.ok(res, supplies);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Thêm hàng vào chuyến
export const addSupplyToTransportController = async (req, res) => {
  try {
    const { id } = req.params;
    const items = req.body;

    // Kiểm tra và tạo các ghi nhận vận chuyển
    const supplies = await TransportSupplies.insertMany(
      items.map((item) => ({
        transportId: id,
        rescueRequestId: item.rescueRequestId,
        pickupTime: item.pickupTime,
        deliveryTime: item.deliveryTime,
        deliveryLocation: item.deliveryLocation,
        notes: item.notes,
        status: "pending",
      }))
    );
    const result = {
      data: supplies,
      message: "Đã thêm hàng vào chuyến đi",
    };
    return ResponseStatus.created(res, result);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Xóa hàng khỏi chuyến
export const removeSupplyFromTransportController = async (req, res) => {
  try {
    const { id, supplyId } = req.params;

    const deleted = await TransportSupplies.findByIdAndDelete(supplyId);

    if (!deleted) {
      return ResponseStatus.notfound(res);
    }

    return ResponseStatus.ok(res, {
      message: "Xóa hàng khỏi chuyến thành công",
    });
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Cập nhật trạng thái
export const updateSupplyStatusController = async (req, res) => {
  try {
    const { id, supplyId } = req.params;
    const { status, notes } = req.body;

    const supply = await TransportSupplies.findById(supplyId);
    if (!supply) {
      return ResponseStatus.notfound(res);
    }

    const oldStatus = supply.status;
    supply.status = status;
    if (notes) {
      supply.notes = notes;
    }
    await supply.save();

    // Tạo lịch sử
    await StatusHistory.create({
      referenceTable: "TransportSupplies",
      referenceId: supplyId,
      action: "update_status",
      oldStatus,
      newStatus: status,
      changedBy: req.user?._id || "676452c5b85460f14f0b1d76",
      description: notes,
    });

    return ResponseStatus.ok(res, supply);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Phân phối hàng hóa tại điểm đích
export const distributeSuppliesController = async (req, res) => {
  try {
    const { id } = req.params;
    const { items, location, notes } = req.body;

    // Cập nhật số lượng các item đã phân phối
    for (const item of items) {
      // Giảm số lượng trong kho
      await ContributionDetails.findByIdAndUpdate(item.contributionDetailId, {
        $inc: { remainingQuantity: -item.quantity },
        $set: { status: "distributed" },
      });

      // Cập nhật trạng thái vận chuyển
      await TransportSupplies.findOneAndUpdate(
        {
          transportId: id,
          _id: item.transportSuppliesId,
        },
        {
          $set: {
            status: "completed",
            deliveryLocation: location,
            notes,
          },
        }
      );
    }

    // TODO: Cập nhật thông tin phân phối cho rescue request

    // Tạo lịch sử
    await StatusHistory.create({
      referenceTable: "TransportSupplies",
      referenceId: id,
      action: "distribute",
      oldStatus: "in_progress",
      newStatus: "completed",
      changedBy: req.user?._id || "676452c5b85460f14f0b1d76",
      description: notes,
    });

    return ResponseStatus.ok(res, { message: "Phân phối hàng hóa thành công" });
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};
