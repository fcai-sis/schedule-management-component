import { InstructorTeachingModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

type HandlerRequest = Request<
  {},
  {},
  {
    instructorId: string;
    courseId: string;
    semesterId: string;
  }
>;

const handler = async (req: HandlerRequest, res: Response) => {
  const { instructorId, courseId, semesterId } = req.body;
  const instructorTeaching = new InstructorTeachingModel({
    instructorId,
    courseId,
    semesterId,
  });

  await instructorTeaching.save();
  const response = {
    message: "Instructor Teaching created successfully",
    instructorTeaching: {
      ...instructorTeaching.toObject(),
    },
  };

  return res.status(201).json(response);
};

const createInstructorTeachingHandler = handler;
export default createInstructorTeachingHandler;
