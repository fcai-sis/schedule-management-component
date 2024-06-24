import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";

import createScheduleHandler from "./schedule-logic/handlers/createSchedule.handler";
import getScheduleHandler from "./schedule-logic/handlers/getSchedule.handler";
import updateScheduleHandler from "./schedule-logic/handlers/updateSchedule.handler";
import { Role, checkRole } from "@fcai-sis/shared-middlewares";
import getCustomTeachingScheduleHandler from "./schedule-logic/handlers/getCustomSchedule.handler";
import getStudentScheduleHandler from "./schedule-logic/handlers/getStudentSchedule.handler";
import validateCreateScheduleRequestMiddleware from "./schedule-logic/middlewares/createSchedule.middleware";
import paginate from "express-paginate";

const schedulesRoutes = (router: Router) => {
  router.post(
    "/",

    validateCreateScheduleRequestMiddleware,

    asyncHandler(createScheduleHandler)
  );

  router.get("/", paginate.middleware(), asyncHandler(getScheduleHandler));

  router.get(
    "/teaching",

    checkRole([Role.INSTUCTOR, Role.TEACHING_ASSISTANT]),

    asyncHandler(getCustomTeachingScheduleHandler)
  );

  router.get(
    "/student",

    checkRole([Role.STUDENT]),

    asyncHandler(getStudentScheduleHandler)
  );

  // TODO: Create a filterable endpoint for the schedule

  // TODO: Create a delete endpoint for the schedule?

  router.patch("/:scheduleId", asyncHandler(updateScheduleHandler));
};

export default schedulesRoutes;
