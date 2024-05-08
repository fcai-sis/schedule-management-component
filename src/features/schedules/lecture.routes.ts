import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";
import createLectureHandler from "./lecture-logic/handlers/createLecture.handler";
import ensureHallAndSlotUnique from "./lecture-logic/middlewares/ensureHallAndSlotUnique.middleware";
import deleteLectureHandler from "./lecture-logic/handlers/deleteLecture.handler";
import ensureInstructorAvailbility from "./lecture-logic/middlewares/ensureInstructorAvailbility.middleware";


const lecturesRoutes = (router: Router) => {
  router.post(
    "/",

    ensureHallAndSlotUnique,
    ensureInstructorAvailbility,

    asyncHandler(createLectureHandler)
  );

  router.delete(
    "/:lectureId",

    asyncHandler(deleteLectureHandler)
  );
};

export default lecturesRoutes;
