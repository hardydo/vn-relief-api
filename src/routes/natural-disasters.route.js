import { Router } from "express";

const NaturalDisastersRouter = Router();

// - Lấy danh sách đợt thiên tai
NaturalDisastersRouter.get("", (req, res) => {
  res.status(200).json({ message: "Test" });
});
// - Lấy chi tiết đợt thiên tai
NaturalDisastersRouter.get("/:id");
// - Tạo đợt thiên tai mới
NaturalDisastersRouter.post("");
// - Cập nhật đợt thiên tai
NaturalDisastersRouter.put("/:id");
// - Xóa đợt thiên tai
NaturalDisastersRouter.delete("/:id");
// - Lấy đợt thiên tai đang diễn ra
NaturalDisastersRouter.get("/active");

// - Lấy thông tin của đợt thiên tai
NaturalDisastersRouter.get("/:id/info");
// - Thêm thông tin cho đợt thiên tai
NaturalDisastersRouter.post("/:id/info");
// - Cập nhật thông tin
NaturalDisastersRouter.put("/:id/info/:infoId");
// - Xóa thông tin
NaturalDisastersRouter.delete("/:id/info/:infoId");

export default NaturalDisastersRouter;
