import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";
import createInstructorTeachingValidatorMiddleware from "./instructorTeaching-logic/middlewares/createInstructorTeachingValidator.middleware";
import createInstructorTeachingHandler from "./instructorTeaching-logic/handlers/createInstructorTeaching.handler";
import getInstructorTeachingHandler from "./instructorTeaching-logic/handlers/getInstructorTeaching.handler";
import getPaginatedInstructorTeachingHandler from "./instructorTeaching-logic/handlers/getPaginatedInstructorTeaching.handler";
import getInstructorTeachingByIdHandler from "./instructorTeaching-logic/handlers/getInstructorTeachingById.handler";
import deleteInstructorTeachingHandler from "./instructorTeaching-logic/handlers/deleteInstructorTeaching.handler";
import ensureInstructorTeachingIdInParamsMiddleware from "./instructorTeaching-logic/middlewares/ensureInstructorTeachingIdInParams.middleware";
import checkCourseAvailabilityMiddleware from "./instructorTeaching-logic/middlewares/checkCourseAvailability.middleware";
import updateInstructorTeachingHandler from "./instructorTeaching-logic/handlers/updateInstructorTeaching.handler";
import paginate from "express-paginate";

const intstuctorTeachingRoutes = (router: Router) => {
  router.post(
    "/",

    createInstructorTeachingValidatorMiddleware,

    checkCourseAvailabilityMiddleware,

    asyncHandler(createInstructorTeachingHandler)
  );

  router.get(
    "/",

    asyncHandler(getInstructorTeachingHandler)
  );

  router.get(
    "/read",

    paginate.middleware(),
    asyncHandler(getPaginatedInstructorTeachingHandler)
  );

  router.get(
    "/:instructorTeachingId",

    asyncHandler(getInstructorTeachingByIdHandler)
  );

  router.patch(
    "/:instructorTeachingId",

    ensureInstructorTeachingIdInParamsMiddleware,

    checkCourseAvailabilityMiddleware,

    asyncHandler(updateInstructorTeachingHandler)
  );

  router.delete(
    "/:instructorTeachingId",

    ensureInstructorTeachingIdInParamsMiddleware,

    asyncHandler(deleteInstructorTeachingHandler)
  );
};

export default intstuctorTeachingRoutes;