import { ScheduleModel, ScheduleType } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

type HandlerRequest = Request<
  {},
  {},
  {
    schedule: ScheduleType;
  }
>;
/**
 * Create a schedule object which contains a semester object alongside other schedule details.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const { schedule } = req.body;

  const createdSchedule = new ScheduleModel({
    description: schedule.description,
    level: schedule.level,
    department: schedule.department,
    semester: schedule.semester,
  });

  await createdSchedule.save();

  const response = {
    message: "Schedule created successfully",
    schedule: {
      ...createdSchedule.toObject(),
      _id: undefined,
      __v: undefined,
    },
  };
  return res.status(201).json(response);
};
const createScheduleHandler = handler;
export default createScheduleHandler;
