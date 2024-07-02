import { Request, Response, NextFunction } from "express";
import * as validator from "express-validator";

const middlewares = [
  validator
    .param("lectureId")

    .exists()
    .withMessage("Lecture ID is required")

    .isMongoId()
    .withMessage("Lecture ID must be a valid Mongo ID"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: errors.array()[0].msg,
        },
      });
    }

    req.params.lectureId = req.params.lectureId.trim();

    next();
  },
];

const ensureLectureIdInParamsMiddleware = middlewares;
export default ensureLectureIdInParamsMiddleware;
