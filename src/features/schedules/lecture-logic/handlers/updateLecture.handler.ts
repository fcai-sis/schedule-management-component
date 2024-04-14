import { Request, Response } from "express";
import LectureModel from "../../data/models/lecture.model";


type HandlerRequest = Request<
  {
    lectureId: string;
  },
  {},
  {
    scheduleId?: string;
    hallId?: string;
    slotId?: string;
    courseId?: string;
    instructorId?: string;
  }
>;

/**
 * Update a lecture object.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const lectureId = req.params.lectureId;

  const lecture = await LectureModel.findByIdAndUpdate(
    lectureId,
    { ...req.body },
    { new: true }
  );

  if (!lecture) {
    return res.status(404).json({
      error: {
        message: "Lecture not found",
      },
    });
  }

  const response = {
    message: "Lecture updated successfully",
    lecture: {
      ...lecture.toObject(),
    },
  };

  return res.status(200).json(response);
};

const updateLectureHandler = handler;

export default updateLectureHandler;
