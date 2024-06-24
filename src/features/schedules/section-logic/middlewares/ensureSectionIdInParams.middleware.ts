import { validateRequestMiddleware } from "@fcai-sis/shared-middlewares";
import { Request, Response, NextFunction } from "express";
import * as validator from "express-validator";

const middlewares = [
  validator
    .param("sectionId")

    .exists()
    .withMessage("Section ID is required")

    .isMongoId()
    .withMessage("Section ID must be a valid Mongo ID"),

  validateRequestMiddleware,
];

const ensureSectionIdInParamsMiddleware = middlewares;
export default ensureSectionIdInParamsMiddleware;
