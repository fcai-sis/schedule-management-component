import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";
import createInstructorTeachingValidatorMiddleware from "./instructorTeaching-logic/middlewares/createInstructorTeachingValidator.middleware";
import createInstructorTeachingHandler from "./instructorTeaching-logic/handlers/createInstructorTeaching.handler";
import getInstructorTeachingHandler from "./instructorTeaching-logic/handlers/getInstructorTeaching.handler";
import { paginationQueryParamsMiddleware } from "@fcai-sis/shared-middlewares";
import getPaginatedInstructorTeachingHandler from "./instructorTeaching-logic/handlers/getPaginatedInstructorTeaching.handler";
import getInstructorTeachingByIdHandler from "./instructorTeaching-logic/handlers/getInstructorTeachingById.handler";
import deleteInstructorTeachingHandler from "./instructorTeaching-logic/handlers/deleteInstructorTeaching.handler";


const intstuctorTeachingRoutes = (router: Router) => {
  router.post(
    "/",

    createInstructorTeachingValidatorMiddleware,

    asyncHandler(createInstructorTeachingHandler)
  );

  router.get(
    "/",

    asyncHandler(getInstructorTeachingHandler)
  );

  router.get(
    "/read",

    paginationQueryParamsMiddleware,

    asyncHandler(getPaginatedInstructorTeachingHandler)
  );

  router.get(
    "/:instructorTeachingId",

    asyncHandler(getInstructorTeachingByIdHandler)
  );

  router.delete(
    "/:instructorTeachingId",

    asyncHandler(deleteInstructorTeachingHandler)
  );
};

export default intstuctorTeachingRoutes;