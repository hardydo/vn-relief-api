// In borrow-vehicles.routes.js:

import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { saveBorrowVehicleController } from "../controllers/borrow-vehicle.controller.js";

const borrowVehiclesRouter = express.Router();

borrowVehiclesRouter.post(
  "/borrow",
  authMiddleware,
  saveBorrowVehicleController
);

export default borrowVehiclesRouter;
