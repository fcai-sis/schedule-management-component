import { Request, Response } from "express";
import TaTeachingModel from "../../data/models/taTeaching.model";


type HandlerRequest = Request<
  {
    taId?: string;
    courseId?: string;
    semesterId?: string;
  },
  {},
  {}
>;


const handler = async (req: HandlerRequest, res: Response) => {
  const { taId, courseId, semesterId } = req.query;

  const query = {
    ...(taId && { taId }),
    ...(courseId && { courseId }),
    ...(semesterId && { semesterId }),
  };

  const taTeaching = await TaTeachingModel.find(query)
  .populate("taId")
    .populate("courseId")
    .populate("semesterId");


  const response = {
    taTeaching: taTeaching.map((taTeaching) => taTeaching.toObject()),
  };

  return res.status(200).json(response);
};

const getTaTeachingHandler = handler;
export default getTaTeachingHandler;