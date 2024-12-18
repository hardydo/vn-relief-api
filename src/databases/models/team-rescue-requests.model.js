import mongoose, { Schema } from "mongoose";

// Đội cứu trợ nhận yêu cầu
// Bảng trung gian của "đội cứu trợ" và "yêu cầu cứu trợ"
const teamRescueRequestSchema = new Schema(
  {
    rescueTeamId: {
      type: Schema.Types.ObjectId,
      ref: "RescueTeams",
    },
    rescueRequestId: {
      type: Schema.Types.ObjectId,
      ref: "RescueRequests",
    },
    pickupTime: Date,
    deliveryTime: Date,
    status: {
      type: String,
      enum: ["pending", "accepted", "in_progress", "completed", "cancelled"],
    },
    notes: String,
  },
  { timestamps: true }
);

const TeamRescueRequests = mongoose.model(
  "TeamRescueRequests",
  teamRescueRequestSchema
);
export default TeamRescueRequests;
