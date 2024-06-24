import {
  InstructorTeachingModel,
  InstructorTeachingType,
} from "@fcai-sis/shared-models";
import { Request, Response } from "express";

type HandlerRequest = Request<
  {
    instructorTeachingId: string;
  },
  {},
  {
    instructorTeaching: Partial<InstructorTeachingType>;
  }
>;

/**
 * Update Instructor teaching object.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const instructorTeachingId = req.params.instructorTeachingId;
  const { instructorTeaching } = req.body;

  const createdInstructorTeaching =
    await InstructorTeachingModel.findByIdAndUpdate(
      instructorTeachingId,
      {
        ...(instructorTeaching.instructor && {
          instructor: instructorTeaching.instructor,
        }),
        ...(instructorTeaching.course && { course: instructorTeaching.course }),
        ...(instructorTeaching.semester && {
          semester: instructorTeaching.semester,
        }),
      },
      { new: true, runValidators: true }
    );

  if (!createdInstructorTeaching) {
    return res.status(404).json({
      error: {
        message: "Instructor teaching not found",
      },
    });
  }

  const response = {
    message: "Instructor Teaching updated successfully",
    instructorTeaching: {
      ...createdInstructorTeaching.toObject(),
    },
  };

  return res.status(200).json(response);
};

const updateInstructorTeachingHandler = handler;

export default updateInstructorTeachingHandler;
