import { Request, Response, NextFunction } from "express";
import * as validator from "express-validator";

const middlewares = [
  validator
    .param("sectionId")

    .exists()
    .withMessage("Section ID is required")

    .isMongoId()
    .withMessage("Section ID must be a valid Mongo ID"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: errors.array()[0].msg,
        },
      });
    }

    req.params.sectionId = req.params.sectionId.trim();

    next();
  },
];

const ensureSectionIdInParamsMiddleware = middlewares;
export default ensureSectionIdInParamsMiddleware;
