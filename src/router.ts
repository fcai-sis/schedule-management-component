import { Router } from "express";

import semesterRoutes from "./features/schedules/semester.routes.js";

const router: Router = Router();

export default (): Router => {
  semesterRoutes(router);

  return router;
};
