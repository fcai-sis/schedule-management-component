import { InstructorTeachingModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

type HandlerRequest = Request<
  {
    instructorTeachingId: string;
  },
  {},
  {
    instructorId?: string;
    courseId?: string;
    semesterId?: string;
  }
>;

/**
 * Update Instructor teaching object.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const instructorTeachingId = req.params.instructorTeachingId;

  const instructorTeaching = await InstructorTeachingModel.findByIdAndUpdate(
    instructorTeachingId,
    { ...req.body },
    { new: true }
  );

  if (!instructorTeaching) {
    return res.status(404).json({
      error: {
        message: "Instructor teaching not found",
      },
    });
  }

  const response = {
    message: "Instructor Teaching updated successfully",
    instructorTeaching: {
      ...instructorTeaching.toObject(),
    },
  };

  return res.status(200).json(response);
};

const updateInstructorTeachingHandler = handler;

export default updateInstructorTeachingHandler;
