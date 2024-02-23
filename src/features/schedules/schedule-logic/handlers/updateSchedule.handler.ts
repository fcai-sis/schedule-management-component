import { Request, Response } from "express";

import Schedule from "../../data/models/schedule.model";

type HandlerRequest = Request<
  {
    scheduleId: string;
  },
  {},
  {
    description?: string;
    level?: number;
    department?: string;
    semester?: string;
  }
>;

/**
 * Update a schedule object.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const scheduleId = req.params.scheduleId;

  const schedule = await Schedule.findByIdAndUpdate(
    scheduleId,
    { ...req.body },
    { new: true }
  );

  if (!schedule) {
    return res.status(404).json({
      error: {
        message: "Schedule not found",
      },
    });
  }

  const response = {
    message: "Schedule updated successfully",
    schedule: {
      ...schedule.toObject(),
    },
  };

  return res.status(200).json(response);
};

const updateScheduleHandler = handler;

export default updateScheduleHandler;
