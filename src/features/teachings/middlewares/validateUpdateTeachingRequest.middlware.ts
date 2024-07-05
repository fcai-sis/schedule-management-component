import * as validator from "express-validator";

const validateUpdateInstructorTeachingRequestMiddlware = [
  validator
    .body("id")

    .exists()
    .withMessage("instructorId is required")

    .isMongoId()
    .withMessage("instructorId must be a valid MongoId"),

  validator
    .body("courses")
    .exists()
    .withMessage("courseCode is required")

    .isArray({ min: 1 })
    .withMessage("courses must be an array of course codes"),

  validator
    .body("courses.*")
    .isString()
    .withMessage("course code must be a string"),
];
export default validateUpdateInstructorTeachingRequestMiddlware;
