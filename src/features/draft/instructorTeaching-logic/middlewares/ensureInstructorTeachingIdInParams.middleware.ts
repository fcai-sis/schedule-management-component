import { Request, Response, NextFunction } from "express";
import * as validator from "express-validator";

const middlewares = [
  validator
    .param("instructorTeachingId")

    .exists()
    .withMessage("Instructor teaching ID is required")

    .isMongoId()
    .withMessage("Instructor teaching ID must be a valid Mongo ID"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: errors.array()[0].msg,
        },
      });
    }

    req.params.instructorTeachingId = req.params.instructorTeachingId.trim();

    next();
  },
];

const ensureInstructorTeachingIdInParamsMiddleware = middlewares;
export default ensureInstructorTeachingIdInParamsMiddleware;
