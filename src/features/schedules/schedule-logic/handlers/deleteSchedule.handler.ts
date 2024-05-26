import { ScheduleModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";


type HandlerRequest = Request<{ scheduleId: string }, {}, {}>;

/**
 * Delete a schedule by its id.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const scheduleId = req.params.scheduleId;

  const schedule = await ScheduleModel.findByIdAndDelete(scheduleId);

  if (!schedule) {
    return res.status(404).json({
      error: {
        message: "Schedule not found",
      },
    });
  }

  const response = {
    message: "Schedule deleted successfully",
    schedule: {
      ...schedule.toObject(),
    },
  };

  return res.status(200).json(response);
};

const deleteScheduleHandler = handler;
export default deleteScheduleHandler;
