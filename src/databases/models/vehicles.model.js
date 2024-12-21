import mongoose, { Schema } from "mongoose";

const vehicleSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    rescueTeamId: {
      type: Schema.Types.ObjectId,
      ref: "RescueTeams",
    },
    naturalDisasterId: {
      type: Schema.Types.ObjectId,
      ref: "NaturalDisasters",
    },
    phone: String,
    licensePlate: {
      type: String,
      required: true,
    },
    vehicleType: {
      type: String,
      required: true,
    },
    supportCapability: String,
    maxPassengers: Number,
    currentArea: String,
    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: [Number],
    },
    wardCode: String, //mã xã | mã tỉnh | mã huyện --> "01 | 23 | 34"
    locationTrackingLink: String,
    lastUpdate: Date,
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Vehicles = mongoose.model("Vehicles", vehicleSchema);
export default Vehicles;
