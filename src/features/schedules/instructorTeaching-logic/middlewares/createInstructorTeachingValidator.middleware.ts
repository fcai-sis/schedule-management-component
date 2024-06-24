import * as validator from "express-validator";
import { validateRequestMiddleware } from "@fcai-sis/shared-middlewares";

const createInstructorTeachingValidatorMiddleware = [
  validator
    .body("instructorTeaching.instructor")
    .exists()
    .isMongoId()
    .withMessage("Teacher assistant Id must be a valid mongo id"),
  validator
    .body("instructorTeaching.course")
    .exists()
    .isMongoId()
    .withMessage("courseId must be a valid mongo id"),

  validateRequestMiddleware,
];

export default createInstructorTeachingValidatorMiddleware;
