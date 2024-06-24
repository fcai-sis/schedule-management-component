import { validateRequestMiddleware } from "@fcai-sis/shared-middlewares";
import * as validator from "express-validator";

const middlewares = [
  validator
    .param("scheduleId")

    .exists()
    .withMessage("Schedule ID is required")

    .isMongoId()
    .withMessage("Schedule ID must be a valid Mongo ID"),

  validateRequestMiddleware,
];

const ensureScheduleIdInParamsMiddleware = middlewares;
export default ensureScheduleIdInParamsMiddleware;
