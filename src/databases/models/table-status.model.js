import mongoose, { Schema } from "mongoose";

// Bảng lưu các trạng thái của từng Bảng
/**
 * Ví dụ Bảng "yeu_cau_cuu_tro" có các trạng thái ["pending", "accepted", "in_progress", "completed", "cancelled"]
 */
const tableStatusSchema = new Schema(
  {
    referenceTable: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    note: String
  },
  { timestamps: true }
);

const TableStatuses = mongoose.model("TableStatuses", tableStatusSchema);
export default TableStatuses;
