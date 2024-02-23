import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";

import createSemesterHandler from "./logic/handlers/createSemester.handler.ts.js";
import getSemesterHandler from "./logic/handlers/getSemester.handler.js";
import updateSemesterHandler from "./logic/handlers/updateSemester.handler.js";

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
