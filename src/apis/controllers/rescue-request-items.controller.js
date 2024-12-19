import ResponseStatus from "../../response-handler/response-handler.js";
import RescueRequestItems from "../../databases/models/rescue-request-items.model.js";
import RescueRequests from "../../databases/models/rescue-requests.model.js";

// Lấy danh sách nhu yếu phẩm cần hỗ trợ của 1 đơn cứu trợ
export const getRequestItemsController = async (req, res) => {
  try {
    const { id } = req.params;

    const items = await RescueRequestItems.find({ rescueRequestId: id }).sort({
      priority: 1,
      createdAt: -1,
    });

    return ResponseStatus.ok(res, items);
  } catch (error) {
    return ResponseStatus.error(res);
  }
};

// Thêm nhu yếu phẩm
export const addRequestItemsController = async (req, res) => {
  try {
    const { id } = req.params;
    const items = req.body;

    // Kiểm tra rescue request tồn tại
    const request = await RescueRequests.findById(id);
    if (!request) {
      return ResponseStatus.notfound(res);
    }

    // Tạo nhiều item cùng lúc
    const newItems = await RescueRequestItems.insertMany(
      items.map((item) => ({
        ...item,
        rescueRequestId: id,
        remainingQuantity: item.providedQuantity,
      }))
    );

    return ResponseStatus.created(res, newItems);
  } catch (error) {
    return ResponseStatus.error(res);
  }
};

// Cập nhật số lượng/thông tin
export const updateRequestItemController = async (req, res) => {
  try {
    const { id, itemId } = req.params;
    const updateData = req.body;

    const updated = await RescueRequestItems.findByIdAndUpdate(
      itemId,
      {
        $set: {
          ...updateData,
          remainingQuantity: updateData.providedQuantity,
        },
      },
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

// Xóa item
export const deleteRequestItemController = async (req, res) => {
  try {
    const { id, itemId } = req.params;

    const deleted = await RescueRequestItems.findByIdAndDelete(itemId);

    if (!deleted) {
      return ResponseStatus.notfound(res);
    }

    return ResponseStatus.ok(res, "Xóa thành công");
  } catch (error) {
    return ResponseStatus.error(res);
  }
};
