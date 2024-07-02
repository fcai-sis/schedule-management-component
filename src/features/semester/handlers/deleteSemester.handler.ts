import { Request, Response } from "express";
import { SemesterModel } from "@fcai-sis/shared-models";

type HandlerRequest = Request<{ semesterId: string }, {}, {}>;

/**
 * Delete a semester by its id.
 */
const deleteSemesterHandler = async (req: HandlerRequest, res: Response) => {
  const semesterId = req.params.semesterId;

  const semester = await SemesterModel.findByIdAndDelete(semesterId);

  if (!semester) {
    return res.status(404).json({
      errors: [
        {
          message: "Semester not found",
        },
      ],
    });
  }

  const response = {
    message: "Semester deleted successfully",
    semester: {
      ...semester.toObject(),
    },
  };

  return res.status(200).json(response);
};

export default deleteSemesterHandler;
