import { InstructorTeachingModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

type HandlerRequest = Request<{ instructorTeachingId: string }, {}, {}>;

/**
 * Delete a Instructor teaching by its id.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const instructorTeachingId = req.params.instructorTeachingId;

  const instructorTeaching = await InstructorTeachingModel.findById(instructorTeachingId);

  if (!instructorTeaching) {
    return res.status(404).json({
      error: {
        message: "Instructor teaching not found",
      },
    });
  }

  const deletedLecture = await instructorTeaching.deleteOne();

  if (!deletedLecture) {
    return res.status(500).json({
      error: {
        message: "Failed to delete instructor teaching",
      },
    });
  }

  const response = {
    message: "Instructor teaching deleted successfully",
    instructorTeaching: {
      ...instructorTeaching.toObject(),
    },
  };

  return res.status(200).json(response);
};

const deleteInstructorTeachingHandler = handler;
export default deleteInstructorTeachingHandler;
