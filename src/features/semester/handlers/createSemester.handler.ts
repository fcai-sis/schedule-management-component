import { Request, Response } from "express";
import {
  CourseModel,
  SemesterCourseModel,
  SemesterModel,
  SemesterType,
} from "@fcai-sis/shared-models";

type HandlerRequest = Request<
  {},
  {},
  {
    semester: Omit<SemesterType, "createdAt">;
    courses: string[];
  }
>;

/**
 * Create a semester object to store this semester's open courses.
 */
const createSemesterHandler = async (req: HandlerRequest, res: Response) => {
  const { semester, courses } = req.body;

  const createdSemester = await SemesterModel.create({
    season: semester.season,
  });

  const coursesData = await CourseModel.find({
    code: { $in: courses },
  });

  await SemesterCourseModel.insertMany(
    coursesData.map((course) => ({
      semester: createdSemester._id,
      course: course._id,
    }))
  );

  const response = {
    message: "Semester created successfully",
    semester: {
      id: createdSemester._id,
      semester: createdSemester.semester,
      courses: coursesData.map((course) => ({
        name: course.name,
        code: course.code,
        creditHours: course.creditHours,
      })),
    },
  };

  return res.status(201).json(response);
};

export default createSemesterHandler;
