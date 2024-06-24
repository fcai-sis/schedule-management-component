import * as validator from "express-validator";
import { validateRequestMiddleware } from "@fcai-sis/shared-middlewares";
import mongoose from "mongoose";

const ensureDepartmentCodeInParamsMiddleware = [
  validator
    .param("departmentCode")

    .exists()
    .withMessage("departmentCode is required")

    .isString()
    .withMessage("departmentCode must be a valid mongo id")

    .custom((value, { req }) => {
      req.body.departmentCode = new mongoose.Schema.Types.ObjectId(value);
    }),

  validateRequestMiddleware,
];

export default ensureDepartmentCodeInParamsMiddleware;
