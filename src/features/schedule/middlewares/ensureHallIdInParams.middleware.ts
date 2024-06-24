import * as validator from "express-validator";
import { validateRequestMiddleware } from "@fcai-sis/shared-middlewares";
import mongoose from "mongoose";

const ensureHallIdInParamsMiddleware = [
  validator
    .param("hallId")

    .exists()
    .withMessage("hallId is required")

    .isMongoId()
    .withMessage("hallId must be a valid mongo id")

    .custom((value, { req }) => {
      req.body.hall = new mongoose.Schema.Types.ObjectId(value);
    }),

  validateRequestMiddleware,
];

export default ensureHallIdInParamsMiddleware;
