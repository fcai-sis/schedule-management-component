import { Request, Response } from "express";
import { SemesterCourseModel, SemesterModel } from "@fcai-sis/shared-models";

type HandlerRequest = Request<{}, {}, {}>;

/**
 * Gets the latest semester
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const latestSemester = await SemesterModel.findOne({}).sort({
    createdAt: -1,
  });

  if (!latestSemester)
    return res.status(404).json({ errors: [{ message: "No semester found" }] });

  const semesterCourses = await SemesterCourseModel.find({
    semester: latestSemester,
  }).populate("course");

  const response = {
    semester: {
      ...latestSemester.toObject(),
    },
    courses: semesterCourses.map((semesterCourse) => ({
      id: semesterCourse.course._id,
      name: semesterCourse.course.name,
      code: semesterCourse.course.code,
      creditHours: semesterCourse.course.creditHours,
    })),
  };

  return res.status(200).json(response);
};

const getLatestSemesterHandler = handler;
export default getLatestSemesterHandler;
