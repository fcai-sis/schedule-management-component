import { Request, Response } from "express";
import Semester from "../../data/models/semester.model";

type HandlerRequest = Request;

/**
 * Get all available semesters.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const semesters = await Semester.find();

  return res.status(200).send({
    semesters: semesters.map((semester) => ({
      id: semester._id,
      year: semester.year,
      semesterType: semester.semesterType,
      courses: semester.courseIds,
    })),
  });
};

const getSemesterHandler = handler;

export default getSemesterHandler;
