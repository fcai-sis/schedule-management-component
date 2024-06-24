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
    limit?: number;
    page?: number;
  }
>;

const handler = async (req: HandlerRequest, res: Response) => {
  const { ta, course, semester } = req.query;

  const query = {
    ...(ta && { ta }),
    ...(course && { course }),
    ...(semester && { semester }),
  };
  const taTeaching = await TaTeachingModel.find(
    { query },
    { _v: 0 },
    { skip: req.skip ?? 0, limit: req.query.limit as unknown as number }
  );

  const count = await TaTeachingModel.countDocuments(query);
  const totalPages = Math.ceil(count / (req.query.limit as unknown as number));

  const response = {
    lectures: taTeaching.map((taTeaching) => taTeaching.toObject()),
    count,
    totalPages,
    currentPage: req.query.page as unknown as number,
    pageSize: req.query.limit as unknown as number,
  };

  return res.status(200).json(response);
};

const getPaginatedTaTeachingHandler = handler;
export default getPaginatedTaTeachingHandler;
