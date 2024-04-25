import { Request, Response } from "express";
import InstructorTeachingModel from "../../data/models/instructorTeaching.model";

type HandlerRequest = Request<{ instructorTeachingId: string }, {}, {}>;

/**
 * Delete a Instructor teaching by its id.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const instructorTeachingId = req.params.instructorTeachingId;

  const instructorTeaching = await InstructorTeachingModel.findByIdAndDelete(instructorTeachingId);

  if (!instructorTeaching) {
    return res.status(404).json({
      error: {
        message: "Instructor teaching not found",
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
