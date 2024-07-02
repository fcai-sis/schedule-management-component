import { LectureModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

type HandlerRequest = Request<
  {
    lectureId: string;
  },
  {},
  {
    scheduleId?: string;
    hallId?: string;
    slotId?: string;
    teachingId?: string;
  }
>;

/**
 * Update a lecture object.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const lectureId = req.params.lectureId;

  const { scheduleId, hallId, slotId, teachingId } = req.body;

  const lecture = await LectureModel.findByIdAndUpdate(
    lectureId,
    {
      ...(scheduleId && { scheduleId }),
      ...(hallId && { hallId }),
      ...(slotId && { slotId }),
      ...(teachingId && { teachingId }),
    },
    { new: true }
  );

  if (!lecture) {
    return res.status(404).json({
      errors: [
        {
          message: "Lecture not found",
        },
      ],
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
