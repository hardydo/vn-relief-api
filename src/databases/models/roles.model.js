import mongoose, { Schema } from "mongoose";

const roleSchema = new Schema(
  {
    admin: {
      type: Number,
      default: 0, // Vai trò admin
    },
    thanh_vien_doi_cuu_tro: {
      type: Number,
      default: 1, // Vai trò thành viên đội cứu trợ
    },
    TNV_thu_thap_thong_tin: {
      type: Number,
      default: 2, // Vai trò tình nguyện viên thu thập thông tin
    },
    TNV_hotline: {
      type: Number,
      default: 3, // Vai trò tình nguyện viên hotline
    },
    TNV_xac_minh_ket_noi: {
      type: Number,
      default: 4, // Vai trò tình nguyện viên xác minh và kết nối tới đội cứu trợ
    },
    thanh_vien_thuong: {
      type: Number,
      default: 5, // Vai trò thành viên thường
    },
  },
  { timestamps: true }
);

const Roles = mongoose.model("Roles", roleSchema);
export default Roles;
