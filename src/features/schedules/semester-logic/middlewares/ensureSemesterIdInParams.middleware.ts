import { validateRequestMiddleware } from "@fcai-sis/shared-middlewares";
import * as validator from "express-validator";

const middlewares = [
  validator
    .param("semesterId")

    .exists()
    .withMessage("Semester ID is required")

    .isMongoId()
    .withMessage("Semester ID must be a valid Mongo ID"),

  validateRequestMiddleware,
];

const ensureSemesterIdInParamsMiddleware = middlewares;
export default ensureSemesterIdInParamsMiddleware;
