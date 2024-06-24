import * as validator from "express-validator";
import { validateRequestMiddleware } from "@fcai-sis/shared-middlewares";

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
  validateRequestMiddleware,
];

export default createSectionValdiatorMiddleware;
