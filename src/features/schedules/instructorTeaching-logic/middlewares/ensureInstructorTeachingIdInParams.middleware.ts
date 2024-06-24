import { validateRequestMiddleware } from "@fcai-sis/shared-middlewares";
import * as validator from "express-validator";

const middlewares = [
  validator
    .param("instructorTeachingId")

    .exists()
    .withMessage("Instructor teaching ID is required")

    .isMongoId()
    .withMessage("Instructor teaching ID must be a valid Mongo ID"),

  validateRequestMiddleware,
];

const ensureInstructorTeachingIdInParamsMiddleware = middlewares;
export default ensureInstructorTeachingIdInParamsMiddleware;
