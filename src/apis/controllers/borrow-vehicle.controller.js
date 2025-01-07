import ResponseStatus from "../../response-handler/response-handler.js";
import BorrowVehicles from "../../databases/models/borrow-vehicles.model.js";
import Users from "../../databases/models/users.model.js";

export const saveBorrowVehicleController = async (req, res) => {
  try {
    const { userId, lenderId, rescueTeamId } = req.body;

    // Check if user has any pending request for this vehicle
    const existingRequest = await BorrowVehicles.findOne({
      userId,
      lenderId,
      status: "pending",
    });

    if (existingRequest) {
      return ResponseStatus.badRequest(
        res,
        "Bạn đã yêu cầu mượn phương tiện này rồi"
      );
    }

    // If borrowing for rescue team, validate user belongs to that team
    if (rescueTeamId) {
      const user = await Users.findById(userId).populate("rescueTeamId");
      if (
        !user?.rescueTeamId ||
        user.rescueTeamId._id.toString() !== rescueTeamId
      ) {
        return ResponseStatus.badRequest(
          res,
          "Bạn không thuộc đội cứu trợ này"
        );
      }
    }

    const newRequest = await BorrowVehicles.create({
      userId,
      lenderId,
      rescueTeamId,
      status: "pending",
    });

    const result = {
      message: "Đã gửi yêu cầu mượn phương tiện thành công",
      data: newRequest,
    };

    return ResponseStatus.created(res, result);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};
