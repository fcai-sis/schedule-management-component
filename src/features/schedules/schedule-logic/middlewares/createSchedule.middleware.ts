import * as validator from "express-validator";
import { NextFunction, Request, Response } from "express";

import logger from "../../../../core/logger";

/**
 * Validates the request body of the Create course endpoint.
 */
const validateCreateScheduleRequestMiddleware = [
  validator.body("description")
    .exists()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string"),

  validator.body("level")
    .exists()
    .withMessage("Level is required")
    .isNumeric()
    .withMessage("Level must be a number"),

  validator.body("department")
    .exists()
    .withMessage("Department ID is required")
    .isMongoId()
    .withMessage("Department ID must be valid"),

  validator.body("semester")
    .exists()
    .withMessage("Semester ID is required")
    .isMongoId()
    .withMessage("Semester ID must be valid"),

  (req: Request, res: Response, next: NextFunction) => {
    logger.debug(
      `Validating create course req body: ${JSON.stringify(req.body)}`
    );

    // If any of the validations above failed, return an error response
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      logger.debug(
        `Validation failed for create course req body: ${JSON.stringify(
          req.body
        )}`
      );

      return res.status(400).json({
        error: {
          message: errors.array()[0].msg,
        },
      });
    }

    // Attach the validated data to the request body
    req.body.description = req.body.description.trim();
    req.body.level = parseInt(req.body.level, 10);
    req.body.department = req.body.department.trim();
    req.body.semester = req.body.semester.trim();

    next();
  },
];

export default validateCreateScheduleRequestMiddleware;
