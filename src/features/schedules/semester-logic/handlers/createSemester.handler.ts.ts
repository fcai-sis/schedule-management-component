import { Request, Response } from "express";
import Semester from "../../data/models/semester.model";

type HandlerRequest = Request<
  {},
  {},
  {
    year: number;
    semesterType: string;
    courses: string[];
  }
>;

/**
 * Create a semester object to store this semester's open courses.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const { year, semesterType, courses } = req.body;

  const semester = new Semester({
    year,
    semesterType,
    courses,
  });

  await semester.save();
  const response = {
    message: "Semester created successfully",
    semester: {
      ...semester.toObject(),
    },
  };

  return res.status(201).json(response);
};

const createSemesterHandler = handler;

export default createSemesterHandler;
