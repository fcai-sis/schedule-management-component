import { Request, Response } from "express";
import LectureModel from "../../data/models/lecture.model";
import lectureTeachingsModel from "../../data/models/lectureTeachings.model";

type HandlerRequest = Request<{ lectureId: string }, {}, {}>;

/**
 * Delete a Lecture by its id.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const lectureId = req.params.lectureId;

  const lecture = await LectureModel.findByIdAndDelete(lectureId);
  await lectureTeachingsModel.deleteMany({
    lectureId,
  });

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
