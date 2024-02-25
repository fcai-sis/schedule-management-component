import { Request, Response } from "express";
import LectureModel from "../../data/models/lecture.model";

// get lecture filtered by scheduleId or courseId or instructorId or hallId or slotId

type HandlerRequest = Request<
  {
    scheduleId?: string;
    courseId?: string;
    instructorId?: string;
    hallId?: string;
    slotId?: string;
  },
  {},
  {}
>;


const handler = async (req: HandlerRequest, res: Response) => {
  const { scheduleId, courseId, instructorId, hallId, slotId } = req.query;

  const query = {
    ...(scheduleId && { scheduleId }),
    ...(courseId && { courseId }),
    ...(instructorId && { instructorId }),
    ...(hallId && { hallId }),
    ...(slotId && { slotId }),
  };

  const lectures = await LectureModel.find(query)
    .populate("courseId")
    .populate("instructorId")
    .populate("hallId")
    .populate("slotId")
    .populate("scheduleId");


  const response = {
    lectures: lectures.map((lecture) => lecture.toObject()),
  };

  return res.status(200).json(response);
};

const getLectureHandler = handler;
export default getLectureHandler;