import mongoose, { Schema } from "mongoose";

// Thông tin thiên tai
const disasterInformationSchema = new Schema(
  {
    naturalDisasterId: {
      type: Schema.Types.ObjectId,
      ref: "NaturalDisasters",
      required: true,
    },
    wardCode: String, //mã xã | mã tỉnh | mã huyện --> "01 | 23 | 34"
    disasterSeverity: String,
    damageDescription: String,
    affectedHouseholds: Number,
    reporterId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    numberOfAffectedPeople: Number,
    estimatedDamage: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const DisasterInformation = mongoose.model(
  "DisasterInformation",
  disasterInformationSchema
);
export default DisasterInformation;
