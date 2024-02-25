import { Request, Response } from "express";
import Schedule from "../../data/models/schedule.model";

type HandlerRequest = Request<
  {},
  {},
  {
    description: string;
    level: number;
    departmentId: string;
    semesterId: string;
  }
>;

/**
 * Create a schedule object which contains a semester object alongside other schedule details.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const { description, level, departmentId, semesterId } = req.body;

  const schedule = new Schedule({
    description,
    level,
    departmentId,
    semesterId,
  });

  await schedule.save();
  const response = {
    message: "Schedule created successfully",
    schedule: {
      ...schedule.toObject(),
    },
  };

  return res.status(201).json(response);
};

const createScheduleHandler = handler;

export default createScheduleHandler;
