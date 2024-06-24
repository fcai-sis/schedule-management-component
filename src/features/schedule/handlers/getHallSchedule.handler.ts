import { LectureModel, SectionModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";
import { ObjectId } from "mongoose";

type HandlerRequest = Request<
  {},
  {},
  {
    semester: ObjectId;
    hall: ObjectId;
  }
>;

const getHallScheduleHandler = async (req: HandlerRequest, res: Response) => {
  const { hall, semester } = req.body;

  const lectures = await LectureModel.find({
    hall,
    semester,
  });
  const sections = await SectionModel.find({
    hall,
    semester,
  });

  return res.status(200).json({
    message: "Current Student Schedule",
    schedule: {
      lectures,
      sections,
    },
  });
};

export default getHallScheduleHandler;
