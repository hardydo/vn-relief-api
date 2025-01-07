import express from "express";
import authRouter from "./auth.routes.js";
import usersRouter from "./users.routes.js";
import rolesRouter from "./roles.routes.js";
import userRolesRouter from "./user-roles.routes.js";
import naturalDisastersRouter from "./natural-disasters.routes.js";
import disasterInformationRouter from "./disaster-information.routes.js";
import rescueTeamsRouter from "./rescue-teams.routes.js";
import teamRescueRequestsRouter from "./team-rescue-requests.routes.js";
import vehiclesRouter from "./vehicles.routes.js";
import rescueRequestsRouter from "./rescue-requests.routes.js";
import rescueRequestItemsRouter from "./rescue-request-items.routes.js";
import supportLocationsRouter from "./support-locations.routes.js";
import reliefContributionsRouter from "./relief-contributions.routes.js";
import contributionDetailsRouter from "./contribution-details.routes.js";
import transportsRouter from "./transports.routes.js";
import transportHistoriesRouter from "./transport-histories.routes.js";
import transportSuppliesRouter from "./transport-supplies.routes.js";
import transactionsRouter from "./transactions.routes.js";
import statusHistoriesRouter from "./status-histories.routes.js";
import tableStatusRouter from "./table-status.routes.js";
import statisticsRouter from "./statistics.routes.js";
import borrowVehiclesRouter from "./borrow-vehicle.routes.js";

const router = express.Router();

// Xác thực người dùng
router.use("/auth", authRouter);

// Quản lý người dùng
router.use("/users", usersRouter);
router.use("/roles", rolesRouter);
router.use("/user-roles", userRolesRouter);

// Quản lý thông tin thiên tai
router.use("/natural-disasters", naturalDisastersRouter);
router.use("/disaster-information", disasterInformationRouter);

// Quản lý đội cứu trợ
router.use("/rescue-teams", rescueTeamsRouter);
router.use("/team-rescue-requests", teamRescueRequestsRouter);

// Quản lý phương tiện
router.use("/vehicles", vehiclesRouter);
router.use("/borrow-vehicles", borrowVehiclesRouter);

// Quản lý yêu cầu cứu trợ
router.use("/rescue-requests", rescueRequestsRouter);
router.use("/rescue-request-items", rescueRequestItemsRouter);

// Quản lý điểm hỗ trợ
router.use("/support-locations", supportLocationsRouter);

// Quản lý đóng góp cứu trợ
router.use("/relief-contributions", reliefContributionsRouter);
router.use("/contribution-details", contributionDetailsRouter);

// Quản lý vận chuyển
router.use("/transports", transportsRouter);
router.use("/transport-histories", transportHistoriesRouter);
router.use("/transport-supplies", transportSuppliesRouter);

// Quản lý tài chính
router.use("/transactions", transactionsRouter);

// Quản lý hệ thống
router.use("/status-histories", statusHistoriesRouter);
router.use("/table-status", tableStatusRouter);

// Thống kê và báo cáo
router.use("/statistics", statisticsRouter);

export default router;
