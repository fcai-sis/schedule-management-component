import {
  DepartmentModel,
  InstructorTeachingModel,
} from "@fcai-sis/shared-models";
import { Request, Response } from "express";

/**
 * Get all available instructor teachings.
 */

type HandlerRequest = Request;

const getAllInstructorTeachingsHandler = async (
  req: HandlerRequest,
  res: Response
) => {
  const { skip, limit, department } = req.query;
  // fetch department from query params if exists
  const departmentQuery = department
    ? await DepartmentModel.findOne({ code: department })
    : null;
  let instructorTeachings = await InstructorTeachingModel.find({})
    .populate("course")
    .populate({
      path: "instructor",
      populate: {
        path: "department",
      },
    })
    .limit(limit as unknown as number)
    .skip(Number(skip) ?? 0);

  if (departmentQuery) {
    instructorTeachings = instructorTeachings.filter(
      (teaching) =>
        teaching.instructor.department._id.toString() ===
        departmentQuery._id.toString()
    );
  }

  const totalTeachings = await InstructorTeachingModel.countDocuments();
  return res.status(200).send({
    instructorTeachings,
    totalTeachings,
  });
};

export default getAllInstructorTeachingsHandler;
