import { validateRequestMiddleware } from "@fcai-sis/shared-middlewares";
import * as validator from "express-validator";

const middlewares = [
  validator
    .param("taTeachingId")

    .exists()
    .withMessage("Ta teaching ID is required")

    .isMongoId()
    .withMessage("Ta teaching ID must be a valid Mongo ID"),

  validateRequestMiddleware,
];

const ensureTaTeachingIdInParamsMiddleware = middlewares;
export default ensureTaTeachingIdInParamsMiddleware;
