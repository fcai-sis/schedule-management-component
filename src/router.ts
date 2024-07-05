import { Router } from "express";

import scheduleRoutes from "./features/schedule/schedule.routes";
import semesterRoutes from "./features/semester/semester.routes";
import teachingRoutes from "./features/teachings/teachings.routes";

export const scheduleRouter = (): Router => {
  const router = Router();
  scheduleRoutes(router);
  return router;
};

export const semesterRouter = (): Router => {
  const router = Router();
  semesterRoutes(router);
  return router;
};

// export const lecturesRouter = (): Router => {
//   const router = Router();
//   lecturesRoutes(router);
//   return router;
// };

// export const sectionsRouter = (): Router => {
//   const router = Router();
//   sectionsRoutes(router);
//   return router;
// };

// export const TaTeachingRouter = (): Router => {
//   const router = Router();
//   taTeachingRoutes(router);
//   return router;
// };

export const teachingRouter = (): Router => {
  const router = Router();
  teachingRoutes(router);
  return router;
};
