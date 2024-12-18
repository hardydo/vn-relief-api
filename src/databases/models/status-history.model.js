import mongoose, { Schema } from "mongoose";

//Lịch sử --> Lưu lại log khi có bất kỳ hoạt động nào trong web
/**
 * TNV A (changedBy) cập nhật status (action) của bảng yeu_cau_cuu_tro (referenceTable) từ pending (oldStatus) sang cancel (newStates) lúc 17:00 AM 12/18/23 (changeTime)
 */
const statusHistorySchema = new Schema(
  {
    referenceTable: {
      type: String,
      required: true,
    },
    referenceId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    oldStatus: Schema.Types.Mixed,
    newStatus: Schema.Types.Mixed,
    changedBy: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    description: String,
  },
  { timestamps: true }
);

const StatusHistory = mongoose.model("StatusHistory", statusHistorySchema);
export default StatusHistory;
