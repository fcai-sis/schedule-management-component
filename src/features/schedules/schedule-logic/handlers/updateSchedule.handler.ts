import { ScheduleModel, ScheduleType } from "@fcai-sis/shared-models";
import { Request, Response } from "express";


type HandlerRequest = Request<
  {
    scheduleId: string;
  },
  {},
  {
    schedule: Partial<ScheduleType>;
  }
>;

/**
 * Update a schedule object.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const scheduleId = req.params.scheduleId;
  const { schedule } = req.body;

  const updatedSchedule = await ScheduleModel.findByIdAndUpdate(
    scheduleId,
    {
      ...(schedule.description && { description: schedule.description }),
      ...(schedule.level && { level: schedule.level }),
      ...(schedule.department && { department: schedule.department }),
      ...(schedule.semester && { semester: schedule.semester }),
    },
    { new: true }
  );

  if (!updatedSchedule) {
    return res.status(404).json({
      error: {
        message: "Schedule not found",
      },
    });
  }

  const response = {
    message: "Schedule updated successfully",
    schedule: {
      ...updatedSchedule.toObject(),
    },
  };

  return res.status(200).json(response);
};

const updateScheduleHandler = handler;

export default updateScheduleHandler;
