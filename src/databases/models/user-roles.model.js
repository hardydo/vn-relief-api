// models/UserRoles.js
import mongoose, { Schema } from "mongoose";

const userRoleSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    roleId: {
      type: Schema.Types.ObjectId,
      ref: "Roles",
    },
    status: {
      type: String,
      enum: ["pending", "accept"],
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const UserRoles = mongoose.model("UserRoles", userRoleSchema);
export default UserRoles;
