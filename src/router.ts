import { Router } from "express";

import schedulesRoutes from "./features/schedules/schedule.routes.js";
import semestersRoutes from "./features/schedules/semester.routes.js";
import lecturesRoutes from "./features/schedules/lecture.routes.js";
import sectionsRoutes from "./features/schedules/section.routes.js";
import TaTeachingRoutes from "./features/schedules/taTeaching.routes.js";

export const schedulesRouter = (): Router => {
  const router = Router();
  schedulesRoutes(router);
  return router;
};

export const semestersRouter = (): Router => {
  const router = Router();
  semestersRoutes(router);
  return router;
};

export const lecturesRouter = (): Router => {
  const router = Router();
  lecturesRoutes(router);
  return router;
}

export const sectionsRouter = (): Router => {
  const router = Router();
  sectionsRoutes(router);
  return router;
}

export const TaTeachingRouter = (): Router => {
  const router = Router();
  TaTeachingRoutes(router);
  return router;
}
