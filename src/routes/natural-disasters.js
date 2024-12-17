import { Router } from "express";

const NaturalDisastersRouter = Router()
const prefix = "/natural-disasters"

// - Lấy danh sách đợt thiên tai
NaturalDisastersRouter.get(`${prefix}`, (req, res)=> {res.status(200).json({message: "Test"})})
// - Lấy chi tiết đợt thiên tai
NaturalDisastersRouter.get(`${prefix}/:id`)
// - Tạo đợt thiên tai mới
NaturalDisastersRouter.post(`${prefix}`)
// - Cập nhật đợt thiên tai
NaturalDisastersRouter.put(`${prefix}/:id`)
// - Xóa đợt thiên tai
NaturalDisastersRouter.delete(`${prefix}/:id`)
// - Lấy đợt thiên tai đang diễn ra
NaturalDisastersRouter.get(`${prefix}/active`)


// - Lấy thông tin của đợt thiên tai
NaturalDisastersRouter.get(`${prefix}/:id/info`)
// - Thêm thông tin cho đợt thiên tai
NaturalDisastersRouter.post(`${prefix}/:id/info`)
// - Cập nhật thông tin
NaturalDisastersRouter.put(`${prefix}/:id/info/:infoId`)
// - Xóa thông tin
NaturalDisastersRouter.delete(`${prefix}/:id/info/:infoId`)
export default NaturalDisastersRouter