import {
  InstructorTeachingModel,
  InstructorTeachingType,
  SemesterModel,
} from "@fcai-sis/shared-models";
import { Request, Response } from "express";

type HandlerRequest = Request<
  {},
  {},
  {
    instructorTeaching: Omit<InstructorTeachingType, "semester">;
  }
>;

const handler = async (req: HandlerRequest, res: Response) => {
  const { instructorTeaching } = req.body;
  const semester = await SemesterModel.findOne()
    .sort({ createdAt: -1 })
    .select("_id");

  if (!semester) {
    return res.status(400).json({
      error: {
        message: "No semester found",
      },
    });
  }

  const createdInstructorTeaching = new InstructorTeachingModel({
    instructor: instructorTeaching.instructor,
    course: instructorTeaching.course,
    semester: semester._id,
  });

  await createdInstructorTeaching.save();
  const response = {
    message: "Instructor Teaching created successfully",
    instructorTeaching: {
      ...createdInstructorTeaching.toObject(),
    },
  };

  return res.status(201).json(response);
};

const createInstructorTeachingHandler = handler;
export default createInstructorTeachingHandler;
