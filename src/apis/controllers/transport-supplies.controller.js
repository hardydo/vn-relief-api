import ResponseStatus from "../../response-handler/response-handler.js";
import TransportSupplies from "../../databases/models/transport-supplies.model.js";
import ContributionDetails from "../../databases/models/contribution-details.model.js";
import StatusHistory from "../../databases/models/status-history.model.js";

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
    const { rescueRequestId, items, pickupTime, deliveryTime } = req.body;

    // Kiểm tra và tạo các ghi nhận vận chuyển
    const supplies = await TransportSupplies.insertMany(
      items.map((item) => ({
        transportId: id,
        rescueRequestId,
        itemId: item.id,
        quantity: item.quantity,
        pickupTime,
        deliveryTime,
        status: "pending",
      }))
    );

    return ResponseStatus.created(res, supplies);
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

    return ResponseStatus.ok(res, "Xóa hàng khỏi chuyến thành công");
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
      changedBy: req.user?._id,
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
    const { items, rescueRequestInfo, location, notes } = req.body;

    // Cập nhật số lượng các item đã phân phối
    for (const item of items) {
      // Giảm số lượng trong kho
      await ContributionDetails.findByIdAndUpdate(item.itemId, {
        $inc: { remainingQuantity: -item.quantity },
        $set: { status: "distributed" },
      });

      // Cập nhật trạng thái vận chuyển
      await TransportSupplies.findOneAndUpdate(
        {
          transportId: id,
          "items.itemId": item.itemId,
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
      changedBy: req.user?._id,
      description: notes,
    });

    return ResponseStatus.ok(res, "Phân phối hàng hóa thành công");
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};
