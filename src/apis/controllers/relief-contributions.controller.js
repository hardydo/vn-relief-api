import ResponseStatus from "../../response-handler/response-handler.js";
import ReliefContributions from "../../databases/models/relief-contributions.model.js";
import Users from "../../databases/models/users.model.js";

// Lấy danh sách đóng góp
export const getContributionsController = async (req, res) => {
  try {
    const { type, status } = req.query;

    let query = {};
    if (type) {
      query.contributionType = type;
    }
    if (status) {
      query.status = status;
    }

    const contributions = await ReliefContributions.find(query)
      .populate("donorId", "name phone")
      .sort({ createdAt: -1 });

    return ResponseStatus.ok(res, contributions);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Chi tiết đóng góp
export const getContributionByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const contribution = await ReliefContributions.findById(id).populate(
      "donorId",
      "name phone"
    );

    if (!contribution) {
      return ResponseStatus.notfound(res);
    }

    return ResponseStatus.ok(res, contribution);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Tạo đóng góp mới (tạo account nếu chưa có, gửi OTP)
export const createContributionController = async (req, res) => {
  try {
    const { phone, ...contributionData } = req.body;

    // Kiểm tra user tồn tại
    let donor = await Users.findOne({ phone });

    if (!donor) {
      // Tạo user mới với role thanh_vien_thuong
      donor = await Users.create({
        phone,
        role: "thanh_vien_thuong",
        // TODO: Thêm các thông tin khác
      });

      // TODO: Gửi OTP xác thực
    }

    const newContribution = await ReliefContributions.create({
      ...contributionData,
      donorId: donor._id,
    });

    return ResponseStatus.created(res, newContribution);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Cập nhật đóng góp
export const updateContributionController = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await ReliefContributions.findByIdAndUpdate(
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

// Xóa đóng góp
export const deleteContributionController = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await ReliefContributions.findByIdAndDelete(id);

    if (!deleted) {
      return ResponseStatus.notfound(res);
    }

    return ResponseStatus.ok(res, "Xóa thành công");
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};
