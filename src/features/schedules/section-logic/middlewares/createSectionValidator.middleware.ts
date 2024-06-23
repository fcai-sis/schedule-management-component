import * as validator from "express-validator";
import { Request, Response, NextFunction } from "express";
import logger from "../../../../core/logger";

const createSectionValdiatorMiddleware = [
  validator
    .body("section.groupName")
    .exists()
    .isString()
    .withMessage("groupName must be a string"),
    validator
    .body("section.schedule")
    .exists()
    .isMongoId()
    .withMessage("scheduleId must be a valid mongo id"),
    validator
    .body("section.hall")
    .exists()
    .isMongoId()
    .withMessage("hallId must be a valid mongo id"),
    validator
    .body("section.slot")
    .exists()
    .isMongoId()
    .withMessage("slotId must be a valid mongo id"),
    validator
    .body("section.taTeaching")
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
