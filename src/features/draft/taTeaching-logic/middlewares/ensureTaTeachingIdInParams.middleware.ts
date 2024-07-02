import { Request, Response, NextFunction } from "express";
import * as validator from "express-validator";

const middlewares = [
  validator
    .param("taTeachingId")

    .exists()
    .withMessage("Ta teaching ID is required")

    .isMongoId()
    .withMessage("Ta teaching ID must be a valid Mongo ID"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: errors.array()[0].msg,
        },
      });
    }

    req.params.taTeachingId = req.params.taTeachingId.trim();

    next();
  },
];

const ensureTaTeachingIdInParamsMiddleware = middlewares;
export default ensureTaTeachingIdInParamsMiddleware;
