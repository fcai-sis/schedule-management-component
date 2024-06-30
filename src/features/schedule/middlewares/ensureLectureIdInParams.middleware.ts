import { validateRequestMiddleware } from "@fcai-sis/shared-middlewares";
import * as validator from "express-validator";

const middlewares = [
  validator
    .param("lectureId")

    .exists()
    .withMessage("Lecture ID is required")

    .isMongoId()
    .withMessage("Lecture ID must be a valid Mongo ID"),

  validateRequestMiddleware,
];

const ensureLectureIdInParamsMiddleware = middlewares;
export default ensureLectureIdInParamsMiddleware;
