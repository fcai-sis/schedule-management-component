import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";

import createScheduleHandler from "./schedule-logic/handlers/createSchedule.handler.js";
import getScheduleHandler from "./schedule-logic/handlers/getSchedule.handler.js";
import updateScheduleHandler from "./schedule-logic/handlers/updateSchedule.handler.js";

export default (router: Router) => {
  router.post(
    "/schedule/create",

    asyncHandler(createScheduleHandler)
  );

  router.get(
    "/schedule",

    asyncHandler(getScheduleHandler)
  );

  router.patch("/schedule/:scheduleId", asyncHandler(updateScheduleHandler));
};
