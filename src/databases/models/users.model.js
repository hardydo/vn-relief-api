import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    rescueTeamId: {
      type: Schema.Types.ObjectId,
      ref: "RescueTeams",
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    fbLink: String,
    livingArea: String,
    supportArea: String,
    password: {
      type: String,
      required: true,
      minLength: [6, "Password must be at least 6 characters"],
    },
    cccd: {
      type: String,
      unique: true,
    },
    wardCode: String, //mã xã | mã tỉnh | mã huyện --> "01 | 23 | 34"
    avatar: String,
    accountStatus: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", userSchema);
export default Users;
