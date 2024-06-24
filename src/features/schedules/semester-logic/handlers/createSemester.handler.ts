import { Request, Response } from "express";
import {
  CourseType,
  SemesterModel,
  SemesterType,
  SemesterCourseModel,
  ICourse,
} from "@fcai-sis/shared-models";

type HandlerRequest = Request<
  {},
  {},
  {
    semester: SemesterType;
    courses: ICourse[];
  }
>;

/**
 * Create a semester object to store this semester's open courses.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const { semester, courses } = req.body;

  const createdSemester = new SemesterModel({
    year: semester.year,
    month: semester.month,
    season: semester.season,
  });

  await createdSemester.save();

  // for each course, create a SemesterCourse object
  await SemesterCourseModel.insertMany(
    courses.map((course) => ({
      semester: createdSemester._id,
      course: course._id,
    }))
  );

  const response = {
    message: "Semester created successfully",
    semester: {
      ...createdSemester.toObject(),
    },
  };

  return res.status(201).json(response);
};

const createSemesterHandler = handler;

export default createSemesterHandler;
