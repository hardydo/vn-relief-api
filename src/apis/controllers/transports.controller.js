import ResponseStatus from "../../response-handler/response-handler.js";
import Transports from "../../databases/models/transports.model.js";
import Vehicles from "../../databases/models/vehicles.model.js";
import SupportLocations from "../../databases/models/support-locations.model.js";

// Lấy danh sách vận chuyển
export const getTransportsController = async (req, res) => {
  try {
    const { status, vehicleId, startDate, endDate } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }
    if (vehicleId) {
      query.vehicleId = vehicleId;
    }
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const transports = await Transports.find(query)
      .populate("vehicleId")
      .populate("pickupLocationId")
      .sort({ createdAt: -1 });

    return ResponseStatus.ok(res, transports);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Chi tiết vận chuyển
export const getTransportByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const transport = await Transports.findById(id)
      .populate("vehicleId")
      .populate("pickupLocationId");

    if (!transport) {
      return ResponseStatus.notfound(res);
    }

    return ResponseStatus.ok(res, transport);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Tạo vận chuyển mới
export const createTransportController = async (req, res) => {
  try {
    const { vehicleId, pickupLocationId, pickupLocation, notes } = req.body;

    // Kiểm tra vehicle và location tồn tại
    const [vehicle, location] = await Promise.all([
      Vehicles.findById(vehicleId),
      SupportLocations.findById(pickupLocationId),
    ]);

    if (!vehicle || !location) {
      return ResponseStatus.badRequest(
        res,
        "Vehicle hoặc Location không tồn tại"
      );
    }

    const newTransport = await Transports.create({
      vehicleId,
      pickupLocationId,
      pickupLocation,
      notes,
    });

    return ResponseStatus.created(res, newTransport);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Cập nhật thông tin vận chuyển
export const updateTransportController = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await Transports.findByIdAndUpdate(
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

// Hủy vận chuyển
export const deleteTransportController = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Transports.findByIdAndDelete(id);

    if (!deleted) {
      return ResponseStatus.notfound(res);
    }

    return ResponseStatus.ok(res, "Hủy vận chuyển thành công");
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};
