import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";
import createTaTeachingValidatorMiddleware from "./taTeaching-logic/middlewares/createTaTeachingValidator.middleware";
import createTaTeachingHandler from "./taTeaching-logic/handlers/createTaTeaching.handler";
import getPaginatedTaTeachingHandler from "./taTeaching-logic/handlers/getPaginatedTaTeaching.handler";
import { paginationQueryParamsMiddleware } from "@fcai-sis/shared-middlewares";
import getTaTeachingHandler from "./taTeaching-logic/handlers/getTaTeaching.handler";
import getTaTeachingByIdHandler from "./taTeaching-logic/handlers/getTaTeachingById.handler";
import deleteTaTeachingHandler from "./lecture-logic/handlers/deleteLecture.handler";


const TaTeachingRoutes =  (router: Router) => {
  router.post(
    "/",

    createTaTeachingValidatorMiddleware,

    asyncHandler(createTaTeachingHandler)
  );

  router.get(
    "/",

    asyncHandler(getTaTeachingHandler)
);

router.get(
    "/read",

    paginationQueryParamsMiddleware,

    asyncHandler(getPaginatedTaTeachingHandler)
);

router.get(
    "/:taTeachingId",

    asyncHandler(getTaTeachingByIdHandler)
);

router.delete(
    "/:taTeachingId",

    asyncHandler(deleteTaTeachingHandler)
);
};

export default TaTeachingRoutes;