import { Request, Response } from "express";
import { SemesterModel } from "@fcai-sis/shared-models";

type HandlerRequest = Request<
  {
    semesterId: string;
  },
  {},
  {
    year?: number;
    semesterType?: string;
    courses?: string[];
  }
>;

/**
 * Update a semester object.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const semesterId = req.params.semesterId;

  const semester = await SemesterModel.findByIdAndUpdate(
    semesterId,
    { ...req.body },
    { new: true }
  );

  if (!semester) {
    return res.status(404).json({
      error: {
        message: "Semester not found",
      },
    });
  }

  const response = {
    message: "Semester updated successfully",
    semester: {
      ...semester.toObject(),
    },
  };

  return res.status(200).json(response);
};

const updateSemesterHandler = handler;

export default updateSemesterHandler;
