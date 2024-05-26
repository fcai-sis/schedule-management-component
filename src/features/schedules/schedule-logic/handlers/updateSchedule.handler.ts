import { ScheduleModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";


type HandlerRequest = Request<
  {
    scheduleId: string;
  },
  {},
  {
    description?: string;
    level?: number;
    departmentId?: string;
    semesterId?: string;
  }
>;

/**
 * Update a schedule object.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const scheduleId = req.params.scheduleId;

  const schedule = await ScheduleModel.findByIdAndUpdate(
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
