import { TaTeachingModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

type HandlerRequest = Request<
  {},
  {},
  {},
  {
    ta?: string;
    course?: string;
    semester?: string;
  }
>;

const handler = async (req: HandlerRequest, res: Response) => {
  const { ta, course, semester } = req.query;

  const query = {
    ...(ta && { ta }),
    ...(course && { course }),
    ...(semester && { semester }),
  };

  const taTeaching = await TaTeachingModel.find(query)
    .populate("ta")
    .populate("course")
    .populate("semester");

  const response = {
    taTeaching: taTeaching.map((taTeaching) => taTeaching.toObject()),
  };

  return res.status(200).json(response);
};

const getTaTeachingHandler = handler;
export default getTaTeachingHandler;
