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

  try {
    const schedule = new Schedule({
      description,
      level,
      departmentId,
      semesterId,
    });

    // Attempt to save the schedule
    await schedule.save();

    // If saved successfully, send a success response
    const response = {
      message: "Schedule created successfully",
      schedule: {
        ...schedule.toObject(),
      },
    };
    return res.status(201).json(response);
  } catch (error: any) {
    // If an error occurs during validation, send an error response
    if (error.name === "ValidationError") {
      const errorMessage = error.errors[Object.keys(error.errors)[0]].message;
      return res.status(400).json({ message: errorMessage });
    } else {
      // For other unexpected errors, send a generic error response
      console.error(error);
      return res.status(500).json({ message: "Failed to create schedule" });
    }
  }
};
const createScheduleHandler = handler;
export default createScheduleHandler;
