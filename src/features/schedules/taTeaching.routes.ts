import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";
import createTaTeachingValidatorMiddleware from "./taTeaching-logic/middlewares/createTaTeachingValidator.middleware";
import createTaTeachingHandler from "./taTeaching-logic/handlers/createTaTeaching.handler";
import getPaginatedTaTeachingHandler from "./taTeaching-logic/handlers/getPaginatedTaTeaching.handler";
import getTaTeachingHandler from "./taTeaching-logic/handlers/getTaTeaching.handler";
import getTaTeachingByIdHandler from "./taTeaching-logic/handlers/getTaTeachingById.handler";
import deleteTaTeachingHandler from "./taTeaching-logic/handlers/deleteTaTeaching.handler";
import checkCourseAvailabilityMiddleware from "./taTeaching-logic/middlewares/checkCourseAvailability.middleware";
import updateTaTeachingHandler from "./taTeaching-logic/handlers/updateTaTeaching.handler";
import ensureTaTeachingIdInParamsMiddleware from "./taTeaching-logic/middlewares/ensureTaTeachingIdInParams.middleware";


const taTeachingRoutes = (router: Router) => {
  router.post(
    "/",

    createTaTeachingValidatorMiddleware,

    checkCourseAvailabilityMiddleware,

    asyncHandler(createTaTeachingHandler)
  );

  router.get(
    "/",

    asyncHandler(getTaTeachingHandler)
  );

  router.get(
    "/read",


    asyncHandler(getPaginatedTaTeachingHandler)
  );

  router.get(
    "/:taTeachingId",

    asyncHandler(getTaTeachingByIdHandler)
  );

  router.patch(
    "/:taTeachingId",

    ensureTaTeachingIdInParamsMiddleware,

    checkCourseAvailabilityMiddleware,

    asyncHandler(updateTaTeachingHandler)
  );

  router.delete(
    "/:taTeachingId",

    ensureTaTeachingIdInParamsMiddleware,

    asyncHandler(deleteTaTeachingHandler)
  );
};

export default taTeachingRoutes;