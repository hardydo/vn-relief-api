import mongoose, { Schema } from "mongoose";

// Bảng mượn phương tiện
const borrowVehiclesSchema = new Schema(
  {
    userId: {
      //người mượn
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    lenderId: {
      //người cho mượn
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    rescueTeamId: {
      //đội cứu trợ mượn
      type: Schema.Types.ObjectId,
      ref: "RescueTeams",
    },
    status: {
      type: String,
      enum: ["pending", "accept", "return", "decline"],
    },
  },
  { timestamps: true }
);

const BorrowVehicles = mongoose.model("BorrowVehicles", borrowVehiclesSchema);
export default BorrowVehicles;
