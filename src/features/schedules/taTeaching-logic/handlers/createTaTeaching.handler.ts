import { Request, Response } from "express";
import { SemesterModel, TaTeachingModel } from "@fcai-sis/shared-models";


type HandlerRequest = Request<
  {},
  {},
  {
    courseId: string;
    taId: string;
  }
>;


const handler = async (req: HandlerRequest, res: Response) => {
  const { taId, courseId } = req.body;
  const semesterId = await SemesterModel.findOne().sort({ createdAt: -1 }).select("_id");

  if (!semesterId) {
    return res.status(400).json({ message: "Semester not found" });
  }

  const taTeaching = new TaTeachingModel({
    taId,
    courseId,
    semesterId
  });

  await taTeaching.save();
  const response = {
    message: "Ta Teaching created successfully",
    taTeaching: {
      ...taTeaching.toObject(),
    },
  };

  return res.status(201).json(response);
}

const createTaTeachingHandler = handler;
export default createTaTeachingHandler;
