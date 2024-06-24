import { Request, Response, NextFunction } from "express";
import {
  SemesterCourseModel,
  SemesterModel,
  TaTeachingType,
} from "@fcai-sis/shared-models";

type MiddlewareHandlerRequest = Request<
  {},
  {},
  {
    taTeaching: TaTeachingType;
  }
>;
const checkCourseAvailabilityMiddleware = async (
  req: MiddlewareHandlerRequest,
  res: Response,
  next: NextFunction
) => {
  const { taTeaching } = req.body;
  const semester = await SemesterModel.findOne({}).sort({ createdAt: -1 });
  const latestSemesterCourses = await SemesterCourseModel.find({
    semester: semester._id,
  });

  if (!taTeaching.course) {
    // If course is not provided in the request query, skip the check
    return next();
  }

  if (!semester) {
    return res.status(404).json({
      error: {
        message: "No semester found",
      },
    });
  }

  const courseExists = latestSemesterCourses.some(
    (semesterCourse) =>
      semesterCourse.course._id.toString() === taTeaching.course.toString()
  );

  if (!courseExists) {
    return res.status(404).json({
      error: {
        message: "Course not found in the latest semester",
      },
    });
  }

  next();
};

export default checkCourseAvailabilityMiddleware;
