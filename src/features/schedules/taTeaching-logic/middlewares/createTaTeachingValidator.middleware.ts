import * as validator from "express-validator";
import { Request, Response, NextFunction } from "express";
import logger from "../../../../core/logger";

const createTaTeachingValidatorMiddleware = [
  validator
    .body("taTeaching.ta")
    .exists()
    .isMongoId()
    .withMessage("Teacher assistant Id must be a valid mongo id"),
  validator
    .body("taTeaching.course")
    .exists()
    .isMongoId()
    .withMessage("courseId must be a valid mongo id"),
  validator
    .body("taTeaching.semester")
    .exists()
    .isMongoId()
    .withMessage("smesterId must be a valid mongo id"),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      logger.error("Validation error", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export default createTaTeachingValidatorMiddleware;
