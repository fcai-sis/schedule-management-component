import { ScheduleModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

type HandlerRequest = Request;

/**
 * Get all available schedules.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const schedules = await ScheduleModel.find(
    {},
    {},
    {
      skip: req.skip ?? 0,
      limit: req.query.limit as unknown as number,
    }
  );

  const totalScheduleCount = await ScheduleModel.countDocuments();
  const totalPages = Math.ceil(
    totalScheduleCount / (req.query.limit as unknown as number)
  );

  return res.status(200).send({
    schedules: schedules.map((schedule) => ({
      ...schedule.toObject(),
    })),
    totalScheduleCount,
    totalPages,
    pageSize: req.query.limit as unknown as number,
  });
};

const getScheduleHandler = handler;

export default getScheduleHandler;
