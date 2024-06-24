import { LectureModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

type HandlerRequest = Request<{ lectureId: string }, {}, {}>;

/**
 * Delete a Lecture by its id.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const lectureId = req.params.lectureId;

  const lecture = await LectureModel.findByIdAndDelete(lectureId);

  if (!lecture) {
    return res.status(404).json({
      error: {
        message: "Lecture not found",
      },
    });
  }

  const response = {
    message: "Lecture deleted successfully",
    lecture: {
      ...lecture.toObject(),
    },
  };

  return res.status(200).json(response);
};

const deleteLectureHandler = handler;
export default deleteLectureHandler;
