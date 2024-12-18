import mongoose, { Schema } from "mongoose";

// Đợt thiên tai
const naturalDisasterSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["ongoing", "ended"],
      required: true,
    },
    startTime: Date,
    endTime: Date,
    description: String,
  },
  { timestamps: true }
);

const NaturalDisasters = mongoose.model(
  "NaturalDisasters",
  naturalDisasterSchema
);
export default NaturalDisasters;
