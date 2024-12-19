import mongoose, { Schema } from "mongoose";

// role
const roleSchema = new Schema(
  {
    code: {
      type: Number,
      required: true,
      enum: [
        0,  // Vai trò admin
        1,  // Vai trò thành viên đội cứu trợ
        2,  // Vai trò tình nguyện viên thu thập thông tin
        3,  // Vai trò tình nguyện viên hotline
        4,  // Vai trò tình nguyện viên xác minh và kết nối tới đội cứu trợ
        5   // Vai trò thành viên thường
      ]
    },
    name: String
  },
  { timestamps: true }
);

const Roles = mongoose.model("Roles", roleSchema);
export default Roles;
