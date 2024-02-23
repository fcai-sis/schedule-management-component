import { Router } from "express";

import semesterRoutes from "./features/schedules/semester.routes.js";
import scheduleRoutes from "./features/schedules/schedule.routes.js";

const router: Router = Router();

export default (): Router => {
  semesterRoutes(router);
  scheduleRoutes(router);

  return router;
};
