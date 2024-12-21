import mongoose, { Schema } from "mongoose";

// đội cứu trợ
const rescueTeamSchema = new Schema(
  {
    teamName: {
      type: String,
      required: true,
    },
    naturalDisasterId: {
      type: Schema.Types.ObjectId,
      ref: "NaturalDisasters",
    },
    leaderId: {
      ref: "User",
      type: Schema.Types.ObjectId,
    },
    operationType: String, // Loại hình hoạt động: y tế, cứu người, di dời,...
    phone: String,
    supportCapability: String,
    livestreamLink: String,
    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: [Number],
    },
    wardCode: String, //mã xã | mã tỉnh | mã huyện --> "01 | 23 | 34"
    operatingArea: String,
    status: String,
    locationTrackingLink: String,
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const RescueTeams = mongoose.model("RescueTeams", rescueTeamSchema);
export default RescueTeams;
