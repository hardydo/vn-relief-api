import ResponseStatus from "../../response-handler/response-handler.js";
import RescueTeams from "../../databases/models/rescue-teams.model.js";
import ReliefContributions from "../../databases/models/relief-contributions.model.js";
import RescueRequests from "../../databases/models/rescue-requests.model.js";
import Transports from "../../databases/models/transports.model.js";

// Thống kê đội cứu trợ
export const getRescueTeamsStatsController = async (req, res) => {
  try {
    const stats = await RescueTeams.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Thêm các thống kê khác như:
    // - Số lượng yêu cầu đã hoàn thành
    // - Số thành viên
    // - Khu vực hoạt động
    // ...

    return ResponseStatus.ok(res, stats);
  } catch (error) {
    return ResponseStatus.error(res);
  }
};

// Thống kê đóng góp
export const getContributionsStatsController = async (req, res) => {
  try {
    const stats = await ReliefContributions.aggregate([
      {
        $group: {
          _id: {
            type: "$contributionType",
            status: "$status",
          },
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    // Thêm các thống kê khác như:
    // - Phân loại theo nguồn (cá nhân/tổ chức)
    // - Phân bố theo khu vực
    // - Xu hướng theo thời gian
    // ...

    return ResponseStatus.ok(res, stats);
  } catch (error) {
    return ResponseStatus.error(res);
  }
};

// Thống kê yêu cầu cứu trợ
export const getRescueRequestsStatsController = async (req, res) => {
  try {
    const stats = await RescueRequests.aggregate([
      {
        $group: {
          _id: {
            type: "$type",
            status: "$status",
          },
          count: { $sum: 1 },
        },
      },
    ]);

    // Thêm các thống kê khác như:
    // - Mức độ ưu tiên
    // - Thời gian xử lý trung bình
    // - Phân bố theo khu vực
    // ...

    return ResponseStatus.ok(res, stats);
  } catch (error) {
    return ResponseStatus.error(res);
  }
};

// Thống kê vận chuyển
export const getTransportStatsController = async (req, res) => {
  try {
    const stats = await Transports.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Thêm các thống kê khác như:
    // - Số lượng hàng đã vận chuyển
    // - Thời gian vận chuyển trung bình
    // - Hiệu suất phương tiện
    // ...

    return ResponseStatus.ok(res, stats);
  } catch (error) {
    return ResponseStatus.error(res);
  }
};
