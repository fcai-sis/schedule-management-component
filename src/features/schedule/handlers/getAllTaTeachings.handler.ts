import { DepartmentModel, TaTeachingModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

/**
 * Get all available TA teachings.
 */

type HandlerRequest = Request;

const getAllTaTeachingsHandler = async (req: HandlerRequest, res: Response) => {
  const { skip, limit, department } = req.query;

  // fetch department from query params if exists
  const departmentQuery = department
    ? await DepartmentModel.findOne({ code: department })
    : null;

  let taTeachings = await TaTeachingModel.find()
    .populate("course")
    .populate({
      path: "ta",
      populate: {
        path: "department",
      },
    })
    .limit(limit as unknown as number)
    .skip(Number(skip) ?? 0);

  if (departmentQuery) {
    taTeachings = taTeachings.filter(
      (teaching) =>
        teaching.ta.department._id.toString() === departmentQuery._id.toString()
    );
  }

  const totalTeachings = await TaTeachingModel.countDocuments();
  return res.status(200).send({
    taTeachings,
    totalTeachings,
  });
};

export default getAllTaTeachingsHandler;
