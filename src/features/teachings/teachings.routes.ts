import { checkRole, Role } from "@fcai-sis/shared-middlewares";
import { asyncHandler } from "@fcai-sis/shared-utilities";
import { Router } from "express";
import getLatestSemesterMiddleware from "../schedule/middlewares/getLatestSemester.middleware";
import updateTeachingHandler from "./handlers/updateTeaching.handler";
import updateTeachingRequestValidatorMiddleware from "./middlewares/validateUpdateTeachingRequest.middlware";

const teachingRoutes = (router: Router) => {
  // Teaching management
  router.patch(
    "/",
    checkRole([Role.ADMIN]),
    getLatestSemesterMiddleware,
    updateTeachingRequestValidatorMiddleware,
    asyncHandler(updateTeachingHandler)
  );

  //   router.get(
  //     "/instructor-teaching",
  //     asyncHandler(getAllInstructorTeachingsHandler)
  //   );

  //   router.get(
  //     "/instructor-teaching/me",
  //     checkRole([Role.INSTRUCTOR]),
  //     getLatestSemesterMiddleware,
  //     asyncHandler(getAuthenticatedInstructorTeachingsHandler)
  //   );

  //   router.delete(
  //     "/instructor-teaching/:instructorTeachingId",
  //     ensureInstructorTeachingIdInParamsMiddleware,
  //     asyncHandler(deleteInstructorTeachingHandler)
  //   );
};

export default teachingRoutes;
