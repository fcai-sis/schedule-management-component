import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";

import createSemesterHandler from "./handlers/createSemester.handler";
import fetchAllSemesterHandler from "./handlers/fetchAllSemesters.handler";
import updateSemesterHandler from "./handlers/updateSemester.handler";
import deleteSemesterHandler from "./handlers/deleteSemester.handler";
import getSemesterByIdHandler from "./handlers/getSemesterById.handler";
import ensureSemesterIdInParamsMiddleware from "./middlewares/ensureSemesterIdInParams.middleware";
import validateCreateSemesterMiddleware from "./middlewares/validateCreateSemester.middleware";

const semestersRoutes = (router: Router) => {
  router.post(
    "/",
    validateCreateSemesterMiddleware,
    asyncHandler(createSemesterHandler)
  );

  router.get("/", asyncHandler(fetchAllSemesterHandler));

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
