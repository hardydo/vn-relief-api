import mongoose, { Schema } from "mongoose";

// đội cứu trợ
const rescueTeamSchema = new Schema(
  {
    teamName: {
      type: String,
      required: true,
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
    livestreamLink: String,
    locationTrackingLink: String,
  },
  { timestamps: true }
);

const RescueTeams = mongoose.model("RescueTeams", rescueTeamSchema);
export default RescueTeams;
