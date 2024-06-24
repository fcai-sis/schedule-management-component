import { Router } from "express";

import scheduleRoutes from "./features/schedule/schedule.routes";
import semestersRoutes from "./features/semester/semester.routes";

export const scheduleRouter = (): Router => {
  const router = Router();
  scheduleRoutes(router);
  return router;
};

export const semestersRouter = (): Router => {
  const router = Router();
  semestersRoutes(router);
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

// export const InstructorTeachingRouter = (): Router => {
//   const router = Router();
//   intstuctorTeachingRoutes(router);
//   return router;
// };
