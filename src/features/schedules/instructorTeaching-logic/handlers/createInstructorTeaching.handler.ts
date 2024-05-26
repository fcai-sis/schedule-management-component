import { InstructorTeachingModel, SemesterModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

type HandlerRequest = Request<
  {},
  {},
  {
    instructorId: string;
    courseId: string;
  }
>;


const handler = async (req: HandlerRequest, res: Response) => {
  const { instructorId, courseId } = req.body;
  const semesterId = await SemesterModel.findOne().sort({ createdAt: -1 }).select("_id");

  if (!semesterId) {
    return res.status(400).json({ message: "Semester not found" });
  }

  const instructorTeaching = new InstructorTeachingModel({
    instructorId,
    courseId,
    semesterId
  });

  await instructorTeaching.save();
  const response = {
    message: "Instructor Teaching created successfully",
    instructorTeaching: {
      ...instructorTeaching.toObject(),
    },
  };

  return res.status(201).json(response);
}

const createInstructorTeachingHandler = handler;
export default createInstructorTeachingHandler;