import { Request, Response } from "express";
import Schedule from "../../data/models/schedule.model";

type HandlerRequest = Request<
  {},
  {},
  {
    description: string;
    level: number;
    department: string;
    semester: string;
  }
>;

/**
 * Create a schedule object which contains a semester object alongside other schedule details.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const { description, level, department, semester } = req.body;

  const schedule = new Schedule({
    description,
    level,
    department,
    semester,
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
