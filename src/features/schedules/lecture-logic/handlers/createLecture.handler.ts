import { Request, Response } from "express";
import LectureModel from "../../data/models/lecture.model";

type HandlerRequest = Request<
  {},
  {},
  {
    scheduleId: string;
    hallId: string;
    slotId: string;
    teachingId: string;
  }
>;


const handler = async (req: HandlerRequest, res: Response) => {
  const { scheduleId, hallId, slotId, teachingId } = req.body;

  const lecture = new LectureModel({
    scheduleId,
    hallId,
    slotId,
    teachingId
  });

  await lecture.save();

  const response = {
    message: "lecture created successfully",
    lecture: {
      ...lecture.toObject(),
    },
  };

  return res.status(201).json(response);
};

const createLectureHandler = handler;

export default createLectureHandler;
