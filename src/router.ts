import { Router } from "express";

import schedulesRoutes from "./features/schedules/schedule.routes";
import semestersRoutes from "./features/schedules/semester.routes";
import lecturesRoutes from "./features/schedules/lecture.routes";
import sectionsRoutes from "./features/schedules/section.routes";
import taTeachingRoutes from "./features/schedules/taTeaching.routes";
import intstuctorTeachingRoutes from "./features/schedules/instructorTeaching.routes";

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
  taTeachingRoutes(router);
  return router;
}

export const InstructorTeachingRouter = (): Router => {
  const router = Router();
  intstuctorTeachingRoutes(router);
  return router;
}
