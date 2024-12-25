import mongoose, { Schema } from "mongoose";

// Chi tiết đóng góp cứu trợ
const borrowVehiclesSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    rescueTeamId: {
      type: Schema.Types.ObjectId,
      ref: "RescueTeams",
    },
    status: {
        type: String,
        enum: ["pending", "accept", "decline"]
    }
  },
  { timestamps: true }
);

const BorrowVehicles = mongoose.model("BorrowVehicles", borrowVehiclesSchema);
export default BorrowVehicles;
