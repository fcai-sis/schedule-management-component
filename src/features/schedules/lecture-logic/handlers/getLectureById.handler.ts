import { Request, Response } from "express";
import LectureModel from "../../data/models/lecture.model";

type HandlerRequest = Request<{ lectureId: string }, {}, {}>;

/**
 * Get a lecture by its id.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const lectureId = req.params.lectureId;

  const lecture = await LectureModel.findById(lectureId)
  .populate("courseId")
  .populate("instructorId")
  .populate("hallId")
  .populate("slotId")
  .populate("scheduleId");

  if (!lecture) {
    return res.status(404).json({
      error: {
        message: "Lecture not found",
      },
    });
  }

  const response = {
    lecture: {
      ...lecture.toObject(),
    },
  };

  return res.status(200).json(response);
}

const getLectureByIdHandler = handler;
export default getLectureByIdHandler;