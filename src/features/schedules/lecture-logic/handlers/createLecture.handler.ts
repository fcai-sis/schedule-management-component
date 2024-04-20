import { Request, Response } from "express";
import LectureModel from "../../data/models/lecture.model";
import lectureTeachingsModel from "../../data/models/lectureTeachings.model";

type HandlerRequest = Request<
  {},
  {},
  {
    scheduleId: string;
    hallId: string;
    slotId: string;
    courseId: string;
    instructorIds: string[];
  }
>;


const handler = async (req: HandlerRequest, res: Response) => {
  const { scheduleId, hallId, slotId, courseId, instructorIds } = req.body;

  const lecture = new LectureModel({
    scheduleId,
    hallId,
    slotId,
    courseId
  });

  await lecture.save();

  for (const instructorId of instructorIds) {
    const lectureTeachings = new lectureTeachingsModel({
      instructorId,
      lectureId: lecture._id,
    });
    await lectureTeachings.save();
  }
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
