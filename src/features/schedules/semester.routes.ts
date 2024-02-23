import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";

import createSemesterHandler from "./semester-logic/handlers/createSemester.handler.ts.js";
import getSemesterHandler from "./semester-logic/handlers/getSemester.handler.js";
import updateSemesterHandler from "./semester-logic/handlers/updateSemester.handler.js";

export default (router: Router) => {
  router.post(
    "/semester/create",

    asyncHandler(createSemesterHandler)
  );

  router.get(
    "/semester",

    asyncHandler(getSemesterHandler)
  );

  router.patch("/semester/:semesterId", asyncHandler(updateSemesterHandler));
};
