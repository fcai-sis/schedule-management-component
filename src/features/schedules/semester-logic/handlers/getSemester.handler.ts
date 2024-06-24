import { Request, Response } from "express";
import { SemesterModel } from "@fcai-sis/shared-models";

type HandlerRequest = Request;

/**
 * Get all available semesters.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const semesters = await SemesterModel.find(
    {},
    { _v: 0 },
    { skip: req.skip ?? 0, limit: req.query.limit as unknown as number }
  );

  const totalSemesterCount = await SemesterModel.countDocuments();
  const totalPages = Math.ceil(
    totalSemesterCount / (req.query.limit as unknown as number)
  );

  return res.status(200).send({
    semesters: semesters.map((semester) => ({
      ...semester.toObject(),
    })),
    totalSemesterCount,
    totalPages,
    pageSize: req.query.limit as unknown as number,
  });
};

const getSemesterHandler = handler;

export default getSemesterHandler;
