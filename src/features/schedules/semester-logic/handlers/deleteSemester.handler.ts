import { Request, Response } from "express";
import { SemesterCourseModel, SemesterModel } from "@fcai-sis/shared-models";

type HandlerRequest = Request<{ semesterId: string }, {}, {}>;

/**
 * Delete a semester by its id.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const semesterId = req.params.semesterId;

  const semester = await SemesterModel.findByIdAndDelete(semesterId);

  if (!semester) {
    return res.status(404).json({
      error: {
        message: "Semester not found",
      },
    });
  }

  // Delete SemesterCourses related to the semester
  await SemesterCourseModel.deleteMany({ semester: semesterId });

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
