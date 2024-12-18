// models/UserRoles.js
import mongoose, { Schema } from "mongoose";

const userRoleSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    roleId: {
      type: Number,
      ref: "Roles",
      required: true,
    },
  },
  { timestamps: true }
);

const UserRoles = mongoose.model("UserRoles", userRoleSchema);
export default UserRoles;
