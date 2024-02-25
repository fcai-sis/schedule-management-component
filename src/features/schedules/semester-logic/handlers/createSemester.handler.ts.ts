import { Request, Response } from "express";
import Semester from "../../data/models/semester.model";

type HandlerRequest = Request<
  {},
  {},
  {
    year: number;
    semesterType: string;
    courseIds: string[];
  }
>;

/**
 * Create a semester object to store this semester's open courses.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const { year, semesterType, courseIds } = req.body;

  const semester = new Semester({
    year,
    semesterType,
    courseIds,
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
