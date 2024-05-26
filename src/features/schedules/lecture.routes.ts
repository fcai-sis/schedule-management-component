import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";
import createLectureHandler from "./lecture-logic/handlers/createLecture.handler";
import ensureHallAndSlotUnique from "./lecture-logic/middlewares/ensureHallAndSlotUnique.middleware";
import ensureInstructorAvailbility from "./lecture-logic/middlewares/ensureInstructorAvailbility.middleware";
import ensureLectureIdInParamsMiddleware from "./lecture-logic/middlewares/ensureLectureIdInParams.middleware";
import updateLectureHandler from "./lecture-logic/handlers/updateLecture.handler";
import deleteLectureHandler from "./lecture-logic/handlers/deleteLecture.handler";


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

    ensureLectureIdInParamsMiddleware,

    asyncHandler(deleteLectureHandler)
  );
};

export default lecturesRoutes;
