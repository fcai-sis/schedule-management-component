import { Request, Response } from "express";
import Schedule from "../../data/models/schedule.model";

type HandlerRequest = Request;

/**
 * Get all available schedules.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const schedules = await Schedule.find();

  return res.status(200).send({
    schedules: schedules.map((schedule) => ({
      id: schedule._id,
      description: schedule.description,
      level: schedule.level,
      department: schedule.department,
      semester: schedule.semester,
    })),
  });
};

const getScheduleHandler = handler;

export default getScheduleHandler;
