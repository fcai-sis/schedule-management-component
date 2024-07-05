import { LectureModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

/**
 * Get all available lectures.
 */

type HandlerRequest = Request;

const getAllLecturesHandler = async (req: HandlerRequest, res: Response) => {
  const { skip, limit } = req.query;

  const lectures = await LectureModel.find()
    .populate("course")
    .populate("hall")
    .populate("slot")
    .limit(limit as unknown as number)
    .skip(req.skip ?? 0);
  console.log(lectures);

  const totalLectures = await LectureModel.countDocuments();
  return res.status(200).send({
    lectures,
    totalLectures,
  });
};

export default getAllLecturesHandler;
