import * as validator from "express-validator";
import { validateRequestMiddleware } from "@fcai-sis/shared-middlewares";

/**
 * Validates the request body of the update schedule endpoint.
 */
const validateCreateScheduleRequestMiddleware = [
  validator
    .body("schedule.description")
    .exists()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string"),

  validator
    .body("schedule.level")
    .exists()
    .withMessage("Level is required")
    .isNumeric()
    .withMessage("Level must be a number"),

  validator
    .body("schedule.department")
    .exists()
    .withMessage("Department ID is required")
    .isMongoId()
    .withMessage("Department ID must be valid"),

  validator
    .body("schedule.semester")
    .exists()
    .withMessage("Semester ID is required")
    .isMongoId()
    .withMessage("Semester ID must be valid"),

  validateRequestMiddleware,
];

export default validateCreateScheduleRequestMiddleware;
