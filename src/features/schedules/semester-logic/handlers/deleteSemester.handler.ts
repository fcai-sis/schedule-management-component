// delete a semester by its id

import { Request, Response } from "express";
import Semester from "../../data/models/semester.model";

type HandlerRequest = Request<{ semesterId: string }, {}, {}>;

/**
 * Delete a semester by its id.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const semesterId = req.params.semesterId;

  const semester = await Semester.findByIdAndDelete(semesterId);

  if (!semester) {
    return res.status(404).json({
      error: {
        message: "Semester not found",
      },
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

const deleteSemesterHandler = handler;

export default deleteSemesterHandler;
