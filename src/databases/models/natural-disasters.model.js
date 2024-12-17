import mongoose from "mongoose";

const DotThienTaiSchema = new mongoose.Schema(
  {
    ten_dot: {
      type: String,
      required: true,
    },
    trang_thai: {
      type: String,
      enum: ["dang_dien_ra", "da_ket_thuc"],
      required: true,
    },
    mo_ta: {
      type: String,
    },
    thoi_gian_bat_dau: {
      type: Date,
    },
    thoi_gian_ket_thuc: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const DotThienTaiModel =  mongoose.model(
    "DotThienTai",
    DotThienTaiSchema,
    "dot_thien_tai"
);
export default DotThienTaiModel
