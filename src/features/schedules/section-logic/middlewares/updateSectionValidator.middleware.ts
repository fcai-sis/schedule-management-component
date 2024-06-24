import * as validator from "express-validator";
import { validateRequestMiddleware } from "@fcai-sis/shared-middlewares";

const updateSectionValidatorMiddleware = [
  validator
    .body("section.groupName")
    .optional()
    .isString()
    .withMessage("groupName must be a string"),
  validator
    .body("section.schedule")
    .optional()
    .isMongoId()
    .withMessage("scheduleId must be a valid mongo id"),
  validator
    .body("section.hall")
    .optional()
    .isMongoId()
    .withMessage("hallId must be a valid mongo id"),
  validator
    .body("section.slot")
    .optional()
    .isMongoId()
    .withMessage("slotId must be a valid mongo id"),
  validateRequestMiddleware,
];

export default updateSectionValidatorMiddleware;
