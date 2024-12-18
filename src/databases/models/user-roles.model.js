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
  },
  { timestamps: true }
);

const UserRoles = mongoose.model("UserRoles", userRoleSchema);
export default UserRoles;
