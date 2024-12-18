import NaturalDisastersRouter from "./natural-disasters.route.js";
import RescueTeamsRouter from "./rescue-teams.route.js";
import RolesRouter from "./roles.route.js";
import UsersRouter from "./users.route.js";
import { Router } from "express";
import VehiclesRouter from "./vehicles.route.js";
import RescueRequestsRouter from "./rescue-requests.route.js";
import SupportLocationsRouter from "./support-locations.route.js";
import DonationItemsRouter from "./donation-items.route.js";
import DonationItemsDetailRouter from "./donation-items-detail.route.js";
import TransportSchedulesRouter from "./transport-schedules.route.js";
import TransactionsRouter from "./transaction.route.js";
import DonationsCashRouter from "./donations-cash.route.js";
import LogsRouter from "./log.route.js";
import StatisticsRouter from "./statistics.route.js";

const CombineRoute = Router()

CombineRoute.use("/natural-disasters", NaturalDisastersRouter)
CombineRoute.use("/users", UsersRouter)
CombineRoute.use("/roles", RolesRouter)
CombineRoute.use("/rescue-teams", RescueTeamsRouter)
CombineRoute.use("/vehicles", VehiclesRouter)
CombineRoute.use("/rescue-requests", RescueRequestsRouter)
CombineRoute.use("/support-locations", SupportLocationsRouter)
CombineRoute.use("/donation-items", DonationItemsRouter)
CombineRoute.use("/donation-items-detail", DonationItemsDetailRouter)
CombineRoute.use("/transport-schedules", TransportSchedulesRouter)
CombineRoute.use("/transactions", TransactionsRouter)
CombineRoute.use("/donation-cash", DonationsCashRouter)
CombineRoute.use("/logs", LogsRouter)
CombineRoute.use("/statistics", StatisticsRouter)

export default CombineRoute