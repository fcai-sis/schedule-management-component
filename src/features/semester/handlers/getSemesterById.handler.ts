import { Request, Response } from "express";
import { SemesterCourseModel, SemesterModel } from "@fcai-sis/shared-models";

type HandlerRequest = Request<{ semesterId: string }, {}, {}>;

/**
 * Get a semester by its id.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const semesterId = req.params.semesterId;

  const semester = await SemesterModel.findById(semesterId);

  if (!semester) {
    return res.status(404).json({
      errors: [
        {
          message: "Semester not found",
        },
      ],
    });
  }

  const semesterCourses = await SemesterCourseModel.find({
    semester: semesterId,
  }).populate("course");

  const response = {
    semester: {
      ...semester.toObject(),
      courses: semesterCourses.map((semesterCourse) => ({
        id: semesterCourse.course._id,
        name: semesterCourse.course.name,
        code: semesterCourse.course.code,
        creditHours: semesterCourse.course.creditHours,
      })),
    },
  };

  return res.status(200).json(response);
};

const getSemesterByIdHandler = handler;
export default getSemesterByIdHandler;
