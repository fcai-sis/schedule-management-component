import { ScheduleModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

type HandlerRequest = Request<{ scheduleId: string }, {}, {}>;

/**
 * Get a schedule by its id.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const scheduleId = req.params.scheduleId;

  const schedule = await ScheduleModel.findById(scheduleId);

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
