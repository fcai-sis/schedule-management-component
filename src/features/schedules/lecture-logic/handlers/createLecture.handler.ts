import { LectureModel, LectureType } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

type HandlerRequest = Request<
  {},
  {},
  {
    lecture: LectureType;
  }
>;


const handler = async (req: HandlerRequest, res: Response) => {
  const { lecture } = req.body;

  const createdLecture = new LectureModel({
    schedule: lecture.schedule,
    hall: lecture.hall,
    slot: lecture.slot,
    instructorTeaching: lecture.instructorTeaching,

  });

  await createdLecture.save();

  const response = {
    message: "lecture created successfully",
    lecture: {
      ...createdLecture.toObject(),
    },
  };

  return res.status(201).json(response);
};

const createLectureHandler = handler;

export default createLectureHandler;
