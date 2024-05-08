import * as validator from "express-validator";
import { Request, Response, NextFunction } from "express";
import logger from "../../../../core/logger";

const createSectionValdiatorMiddleware = [
  validator
    .body("groupName")
    .exists()
    .isString()
    .withMessage("groupName must be a string"),
    validator
    .body("scheduleId")
    .exists()
    .isMongoId()
    .withMessage("scheduleId must be a valid mongo id"),
    validator
    .body("hallId")
    .exists()
    .isMongoId()
    .withMessage("hallId must be a valid mongo id"),
    validator
    .body("slotId")
    .exists()
    .isMongoId()
    .withMessage("slotId must be a valid mongo id"),
    validator
    .body("courseId")
    .exists()
    .isMongoId()
    .withMessage("courseId must be a valid mongo id"),
    validator
    .body("teachingId")
    .exists()
    .isMongoId()
    .withMessage("TaTeachingId must be a valid mongo id"),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            logger.error("Validation error", errors.array());
            return res.status(400).json({ errors: errors.array() });
        }
        next();
        },
];

export default createSectionValdiatorMiddleware;
