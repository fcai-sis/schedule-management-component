import { validateRequestMiddleware } from "@fcai-sis/shared-middlewares";
import * as validator from "express-validator";

const middlewares = [
  validator
    .param("taTeachingId")

    .exists()
    .withMessage("TA Teaching ID is required")

    .isMongoId()
    .withMessage("TA Teaching ID must be a valid Mongo ID"),

  validateRequestMiddleware,
];

const ensureTaTeachingIdInParamsMiddleware = middlewares;
export default ensureTaTeachingIdInParamsMiddleware;
