import { InstructorTeachingModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

type HandlerRequest = Request<{ instructorTeachingId: string }, {}, {}>;

/**
 * Get a Instructor teaching by its id.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const instructorTeachingId = req.params.instructorTeachingId;

  const instructorTeaching = await InstructorTeachingModel.findById(
    instructorTeachingId
  )
    .populate("instructorId")
    .populate("courseId")
    .populate("semesterId");

  if (!instructorTeaching) {
    return res.status(404).json({
      error: {
        message: "Instructor teaching not found",
      },
    });
  }

  const response = {
    instructorTeaching: {
      ...instructorTeaching.toObject(),
    },
  };

  return res.status(200).json(response);
};

const getInstructorTeachingByIdHandler = handler;
export default getInstructorTeachingByIdHandler;
