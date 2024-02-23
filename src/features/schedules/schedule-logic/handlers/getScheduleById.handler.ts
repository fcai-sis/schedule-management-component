// get a schedule by its id

import { Request, Response } from "express";
import Schedule from "../../data/models/schedule.model";

type HandlerRequest = Request<{ scheduleId: string }, {}, {}>;

/**
 * Get a schedule by its id.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const scheduleId = req.params.scheduleId;

  const schedule = await Schedule.findById(scheduleId);

  if (!schedule) {
    return res.status(404).json({
      error: {
        message: "Schedule not found",
      },
    });
  }

  const response = {
    schedule: {
      ...schedule.toObject(),
    },
  };

  return res.status(200).json(response);
};

const getScheduleByIdHandler = handler;
export default getScheduleByIdHandler;
