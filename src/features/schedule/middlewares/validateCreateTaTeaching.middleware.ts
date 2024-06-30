import { validateRequestMiddleware } from "@fcai-sis/shared-middlewares";
import { CourseModel } from "@fcai-sis/shared-models";
import * as validator from "express-validator";

const validateCreateTaTeachingRequestMiddlware = [
  validator
    .body("taTeaching.course")

    .exists()
    .withMessage("course is required")

    .isString()
    .withMessage("course must be a string")

    .custom(async (value, { req }) => {
      // check if course exists

      const course = await CourseModel.findOne({ code: value });
      if (!course) throw new Error("Course not found");

      req.body.course = course._id; // strange cast error here
    }),

  validator
    .body("email")

    .exists()
    .withMessage("email is required")

    .isEmail()
    .withMessage("email must be a valid email"),

  validateRequestMiddleware,
];

export default validateCreateTaTeachingRequestMiddlware;
