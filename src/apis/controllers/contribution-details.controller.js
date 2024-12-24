import ResponseStatus from "../../response-handler/response-handler.js";
import ContributionDetails from "../../databases/models/contribution-details.model.js";
import ReliefContributions from "../../databases/models/relief-contributions.model.js";

// Lấy chi tiết items đóng góp của 1 đơn đóng góp
export const getContributionDetailsController = async (req, res) => {
  try {
    const { id } = req.params;

    const details = await ContributionDetails.find({ contributionId: id }).sort(
      { createdAt: -1 }
    );

    return ResponseStatus.ok(res, details);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Thêm items
export const addContributionItemsController = async (req, res) => {
  try {
    const { id } = req.params;
    const items = req.body;

    // Kiểm tra contribution tồn tại
    const contribution = await ReliefContributions.findById(id);
    if (!contribution) {
      return ResponseStatus.notfound(res);
    }

    // Tạo nhiều item cùng lúc
    const newItems = await ContributionDetails.insertMany(
      items.map((item) => ({
        ...item,
        contributionId: id,
        remainingQuantity: item.providedQuantity,
      }))
    );
    const result = {
      message: "Đã thêm vào danh sách đóng góp",
      data: newItems,
    };
    return ResponseStatus.created(res, result);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Cập nhật item
export const updateContributionItemController = async (req, res) => {
  try {
    const { id, detailId } = req.params;
    const updateData = req.body;

    const updated = await ContributionDetails.findByIdAndUpdate(
      detailId,
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
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Xóa item
export const deleteContributionItemController = async (req, res) => {
  try {
    const { id, detailId } = req.params;

    const deleted = await ContributionDetails.findByIdAndDelete(detailId);

    if (!deleted) {
      return ResponseStatus.notfound(res);
    }

    return ResponseStatus.ok(res, "Xóa thành công");
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};
