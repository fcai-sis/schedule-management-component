import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";

import createScheduleHandler from "./schedule-logic/handlers/createSchedule.handler.js";
import getScheduleHandler from "./schedule-logic/handlers/getSchedule.handler.js";
import updateScheduleHandler from "./schedule-logic/handlers/updateSchedule.handler.js";

const schedulesRoutes = (router: Router) => {
  router.post(
    "/",

    asyncHandler(createScheduleHandler)
  );

  router.get(
    "/",

    asyncHandler(getScheduleHandler)
  );

  router.patch("/:scheduleId", asyncHandler(updateScheduleHandler));
};

export default schedulesRoutes;