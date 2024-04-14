import * as validator from "express-validator";
import { Request, Response, NextFunction } from "express";
import logger from "../../../../core/logger";

const updateSectionValidatorMiddleware = [
    validator
        .body("groupName")
        .optional()
        .isString()
        .withMessage("groupName must be a string"),
    validator
        .body("scheduleId")
        .optional()
        .isMongoId()
        .withMessage("scheduleId must be a valid mongo id"),
    validator
        .body("hallId")
        .optional()
        .isMongoId()
        .withMessage("hallId must be a valid mongo id"),
    validator
        .body("slotId")
        .optional()
        .isMongoId()
        .withMessage("slotId must be a valid mongo id"),
    validator
        .body("courseId")
        .optional()
        .isMongoId()
        .withMessage("courseId must be a valid mongo id"),
    validator
        .body("assistantId")
        .optional()
        .isMongoId()
        .withMessage("assistantId must be a valid mongo id"),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            logger.error("Validation error", errors.array());
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

export default updateSectionValidatorMiddleware;