import { validateRequestMiddleware } from "@fcai-sis/shared-middlewares";
import { CourseModel } from "@fcai-sis/shared-models";
import * as validator from "express-validator";

const validateCreateLectureRequestMiddlware = [
  validator
    .body("lecture.course")

    .exists()
    .withMessage("course is required")

    .isString()
    .withMessage("course must be a string")

    .custom(async (value, { req }) => {
      // check if course exists
      const course = await CourseModel.findOne({ code: value });
      if (!course) throw new Error("course not found");
      req.body.course = course._id;
    }),

  validator
    .body("lecture.hall")

    .exists()
    .withMessage("hall is required")

    .isMongoId()
    .withMessage("hall must be a valid mongo id"),

  validator
    .body("lecture.slot")

    .exists()
    .withMessage("slot is required")

    .isMongoId()
    .withMessage("slot must be a valid mongo id"),

  validateRequestMiddleware,
];

export default validateCreateLectureRequestMiddlware;
