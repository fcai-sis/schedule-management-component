import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";

import createSemesterHandler from "./semester-logic/handlers/createSemester.handler";
import getSemesterHandler from "./semester-logic/handlers/getSemester.handler";
import updateSemesterHandler from "./semester-logic/handlers/updateSemester.handler";
import ensureSemesterIdInParamsMiddleware from "./semester-logic/middlewares/ensureSemesterIdInParams.middleware";
import deleteSemesterHandler from "./semester-logic/handlers/deleteSemester.handler";
import getSemesterByIdHandler from "./semester-logic/handlers/getSemesterById.handler";

const semestersRoutes = (router: Router) => {
  router.post(
    "/",

    asyncHandler(createSemesterHandler)
  );

  router.get(
    "/",

    asyncHandler(getSemesterHandler)
  );

  router.get(
    "/:semesterId",

    ensureSemesterIdInParamsMiddleware,

    asyncHandler(getSemesterByIdHandler)
  );

  router.patch(
    "/:semesterId",

    ensureSemesterIdInParamsMiddleware,

    asyncHandler(updateSemesterHandler)
  );

  router.delete(
    "/:semesterId",
    ensureSemesterIdInParamsMiddleware,

    asyncHandler(deleteSemesterHandler)
  );
};

export default semestersRoutes;
