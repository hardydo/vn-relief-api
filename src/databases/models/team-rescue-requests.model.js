import mongoose, { Schema } from "mongoose";

// Đội cứu trợ nhận yêu cầu
// Bảng trung gian của "đội cứu trợ" và "yêu cầu cứu trợ"
const teamRescueRequestSchema = new Schema(
  {
    rescueTeamId: {
      type: Schema.Types.ObjectId,
      ref: "RescueTeams",
      required: true,
    },
    rescueRequestId: {
      type: Schema.Types.ObjectId,
      ref: "RescueRequests",
      required: true,
    },
    verifierId: {
      //tình nguyện viên role xác minh kết nối
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
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
