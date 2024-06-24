import * as validator from "express-validator";
import { validateRequestMiddleware } from "@fcai-sis/shared-middlewares";

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

  validateRequestMiddleware,
];

export default createTaTeachingValidatorMiddleware;
