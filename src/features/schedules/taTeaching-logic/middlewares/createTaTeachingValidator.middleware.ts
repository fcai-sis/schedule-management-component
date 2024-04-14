import * as validator from "express-validator";
import { Request, Response, NextFunction } from "express";
import logger from "../../../../core/logger";

const createTaTeachingValidatorMiddleware = [
  validator
    .body("taId")
    .isMongoId()
    .withMessage("Teacher assistant Id must be a valid mongo id"),
  validator
    .body("courseId")
    .isMongoId()
    .withMessage("courseId must be a valid mongo id"),
  validator
    .body("semesterId")
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
