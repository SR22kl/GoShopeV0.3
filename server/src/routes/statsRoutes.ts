import express from "express";
import {
  getBarCharts,
  getDashboardStats,
  getLineCharts,
  getPieCharts,
} from "../controllers/statsController.js";

import { adminOnly } from "../middleware/auth.js";

const statsRouter = express.Router();

// route - /api/v1/dashboard/stats
statsRouter.get("/stats", adminOnly, getDashboardStats);

// route - /api/v1/dashboard/pie
statsRouter.get("/pie", adminOnly, getPieCharts);

// route - /api/v1/dashboard/bar
statsRouter.get("/bar", adminOnly, getBarCharts);

// route - /api/v1/dashboard/line
statsRouter.get("/line", adminOnly, getLineCharts);

export default statsRouter;
