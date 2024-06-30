import { validateRequestMiddleware } from "@fcai-sis/shared-middlewares";
import { SemesterSeasonEnum } from "@fcai-sis/shared-models";
import * as validator from "express-validator";

const validateUpdateSemesterMiddleware = [
  validator
    .body("semester.season")

    .optional()

    .isIn(SemesterSeasonEnum)
    .withMessage("Invalid season"),

  validator
    .body("courses")

    .optional()

    .isArray()
    .withMessage("courses must be an array"),

  validator
    .body("courses.*")

    .isString()
    .withMessage("course name must be a string"),

  validateRequestMiddleware,
];

export default validateUpdateSemesterMiddleware;
