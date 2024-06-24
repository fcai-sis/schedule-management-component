import { InstructorTeachingModel, LectureModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

type HandlerRequest = Request<{ instructorTeachingId: string }, {}, {}>;

/**
 * Delete a Instructor teaching by its id.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const instructorTeachingId = req.params.instructorTeachingId;

  try {
    // Find the Instructor teaching
    const instructorTeaching = await InstructorTeachingModel.findById(
      instructorTeachingId
    );

    // If Instructor teaching not found, return 404
    if (!instructorTeaching) {
      return res.status(404).json({
        error: {
          message: "Instructor teaching not found",
        },
      });
    }

    await LectureModel.deleteMany({ instructorTeaching: instructorTeachingId });

    // Delete the Instructor teaching
    await instructorTeaching.deleteOne();

    const response = {
      message: "Instructor teaching deleted successfully",
      instructorTeaching: {
        ...instructorTeaching.toObject(),
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error deleting Instructor teaching:", error);
    return res.status(500).json({
      error: {
        message: "Internal server error",
      },
    });
  }
};

const deleteInstructorTeachingHandler = handler;

export default deleteInstructorTeachingHandler;
