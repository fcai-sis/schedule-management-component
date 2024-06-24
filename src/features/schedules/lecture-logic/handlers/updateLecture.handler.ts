import { LectureModel, LectureType } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

type HandlerRequest = Request<
  {
    lectureId: string;
  },
  {},
  {
    lecture: Partial<LectureType>;
  }
>;

/**
 * Update a lecture object.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const lectureId = req.params.lectureId;
  const { lecture } = req.body;

  const updatedLecture = await LectureModel.findByIdAndUpdate(
    lectureId,
    {
      ...(lecture.schedule && { schedule: lecture.schedule }),
      ...(lecture.hall && { hall: lecture.hall }),
      ...(lecture.slot && { slot: lecture.slot }),
      ...(lecture.instructorTeaching && {
        instructorTeaching: lecture.instructorTeaching,
      }),
    },
    { new: true, runValidators: true }
  );

  if (!updatedLecture) {
    return res.status(404).json({
      error: {
        message: "Lecture not found",
      },
    });
  }

  const response = {
    message: "Lecture updated successfully",
    lecture: {
      ...updatedLecture.toObject(),
    },
  };

  return res.status(200).json(response);
};

const updateLectureHandler = handler;

export default updateLectureHandler;
