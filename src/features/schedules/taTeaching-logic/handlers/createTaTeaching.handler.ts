import { Request, Response } from "express";
import TaTeachingModel from "../../data/models/taTeaching.model";

type HandlerRequest = Request<
  {},
  {},
  {
    semesterId: string;
    courseId: string;
    taId: string;
  }
>;


const handler = async (req: HandlerRequest, res: Response) => {
  const { taId, courseId, semesterId } = req.body;
 console.log("taId", taId);
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