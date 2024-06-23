import { Request, Response } from "express";
import { SemesterModel, TaTeachingModel, TaTeachingType } from "@fcai-sis/shared-models";


type HandlerRequest = Request<
  {},
  {},
  {
    taTeaching: TaTeachingType,
  }
>;


const handler = async (req: HandlerRequest, res: Response) => {
  const { taTeaching } = req.body;
  const semester = await SemesterModel.findOne().sort({ createdAt: -1 }).select("_id");

  if (!semester) {
    return res.status(400).json({ message: "Semester not found" });
  }

  const createdTaTeaching = new TaTeachingModel({
    ta: taTeaching.ta,
    courseId: taTeaching.course,
    semester
  });

  await createdTaTeaching.save();
  const response = {
    message: "Ta Teaching created successfully",
    taTeaching: {
      ...createdTaTeaching.toObject(),
    },
  };

  return res.status(201).json(response);
}

const createTaTeachingHandler = handler;
export default createTaTeachingHandler;
