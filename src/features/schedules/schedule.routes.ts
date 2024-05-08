import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";

// TODO: FIX THE IMPORTS (.js ???)
import createScheduleHandler from "./schedule-logic/handlers/createSchedule.handler.js";
import getScheduleHandler from "./schedule-logic/handlers/getSchedule.handler.js";
import updateScheduleHandler from "./schedule-logic/handlers/updateSchedule.handler.js";
import { Role, checkRole } from "@fcai-sis/shared-middlewares";
import getCustomTeachingScheduleHandler from "./schedule-logic/handlers/getCustomSchedule.handler.js";
import getStudentScheduleHandler from "./schedule-logic/handlers/getStudentSchedule.handler.js";
import validateCreateScheduleRequestMiddleware from "./schedule-logic/middlewares/createSchedule.middleware.js";

const schedulesRoutes = (router: Router) => {
  router.post(
    "/",

    validateCreateScheduleRequestMiddleware,

    asyncHandler(createScheduleHandler)
  );

  router.get(
    "/",

    asyncHandler(getScheduleHandler)
  );

  router.get(
    "/teaching",

    checkRole([
      Role.INSTUCTOR,
      Role.TEACHING_ASSISTANT
    ]),

    asyncHandler(getCustomTeachingScheduleHandler)
  );

  router.get(
    "/student",

    checkRole([
      Role.STUDENT
    ]),

    asyncHandler(getStudentScheduleHandler)
  );

  router.patch("/:scheduleId", asyncHandler(updateScheduleHandler));
};

export default schedulesRoutes;
