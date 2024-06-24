import { validateRequestMiddleware } from "@fcai-sis/shared-middlewares";
import { SemesterSeasonEnum } from "@fcai-sis/shared-models";
import * as validator from "express-validator";

const validateCreateSemesterMiddleware = [
  validator
    .body("semester.season")

    .exists()
    .withMessage("season is required")

    .isIn(SemesterSeasonEnum)
    .withMessage("Invalid season"),

  validator
    .body("courses")

    .exists()
    .withMessage("courses is required")

    .isArray()
    .withMessage("courses must be an array"),

  validator
    .body("courses.*")

    .isString()
    .withMessage("course name must be a string"),

  validateRequestMiddleware,
];

export default validateCreateSemesterMiddleware;
