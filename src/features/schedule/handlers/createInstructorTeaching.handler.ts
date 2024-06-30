import {
  InstructorModel,
  InstructorTeachingModel,
  InstructorTeachingType,
} from "@fcai-sis/shared-models";
import { Request, Response } from "express";
import { ObjectId } from "mongoose";

type HandlerRequest = Request<
  {},
  {},
  {
    instructorTeaching: Omit<InstructorTeachingType, "instructor" | "semester">;
    email: string;
    course: string;
    semester: ObjectId;
  }
>;

const createInstructorTeachingHandler = async (
  req: HandlerRequest,
  res: Response
) => {
  const { email, course, semester } = req.body;

  const instructor = await InstructorModel.findOne({
    email,
  });

  if (!instructor) {
    return res.status(404).json({
      error: {
        message: "Instructor not found",
      },
    });
  }

  const createdInstructorTeaching = await InstructorTeachingModel.create({
    semester,
    course,
    instructor: instructor._id,
  });

  const response = {
    message: "Instructor teaching created successfully",
    instructorTeaching: {
      id: createdInstructorTeaching._id,
      semester: createdInstructorTeaching.semester,
      course: createdInstructorTeaching.course,
      instructor: createdInstructorTeaching.instructor,
    },
  };

  return res.status(201).json(response);
};

export default createInstructorTeachingHandler;
