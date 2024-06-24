import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";
import createLectureHandler from "../schedule/handlers/createLecture.handler";
import ensureHallAndSlotUnique from "../schedule/middlewares/ensureUniqueHallAndSlot.middleware";
import deleteLectureHandler from "../schedule/handlers/deleteLecture.handler";
import ensureInstructorAvailbility from "./lecture-logic/middlewares/ensureInstructorAvailbility.middleware";
import ensureLectureIdInParamsMiddleware from "./lecture-logic/middlewares/ensureLectureIdInParams.middleware";
import updateLectureHandler from "../schedule/handlers/updateLecture.handler";

const lecturesRoutes = (router: Router) => {
  router.post(
    "/",

    ensureHallAndSlotUnique,

    ensureInstructorAvailbility,

    asyncHandler(createLectureHandler)
  );
  router.patch(
    "/:lectureId",

    ensureHallAndSlotUnique,

    ensureInstructorAvailbility,

    ensureLectureIdInParamsMiddleware,

    asyncHandler(updateLectureHandler)
  );
  router.delete(
    "/:lectureId",

    asyncHandler(deleteLectureHandler)
  );
};

export default lecturesRoutes;
