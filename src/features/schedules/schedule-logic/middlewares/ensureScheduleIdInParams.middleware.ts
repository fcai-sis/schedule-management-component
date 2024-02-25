import { Request, Response, NextFunction } from "express";
import * as validator from "express-validator";

const middlewares = [
  validator
    .param("scheduleId")

    .exists()
    .withMessage("Schedule ID is required")

    .isMongoId()
    .withMessage("Schedule ID must be a valid Mongo ID"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: errors.array()[0].msg,
        },
      });
    }

    req.params.scheduleId = req.params.scheduleId.trim();

    next();
  },
];

const ensureScheduleIdInParamsMiddleware = middlewares;
export default ensureScheduleIdInParamsMiddleware;
