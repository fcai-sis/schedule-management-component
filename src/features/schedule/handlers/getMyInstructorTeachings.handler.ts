import { TokenPayload } from "@fcai-sis/shared-middlewares";
import {
  EnrollmentModel,
  IInstructorTeaching,
  InstructorModel,
  InstructorTeachingModel,
} from "@fcai-sis/shared-models";
import { Request, Response } from "express";
import { ObjectId } from "mongoose";

type HandlerRequest = Request<
  {},
  {},
  {
    user: TokenPayload;
    semester: ObjectId;
  }
>;

const getAuthenticatedInstructorTeachingsHandler = async (
  req: HandlerRequest,
  res: Response
) => {
  const { user, semester } = req.body;
  const { skip, limit } = req.query;
  const instructor = await InstructorModel.findOne({ user: user.userId });

  if (!instructor)
    return res
      .status(404)
      .json({ errors: [{ message: "Instructor not found" }] });

  const teachings: IInstructorTeaching[] = await InstructorTeachingModel.find({
    instructor: instructor._id,
    semester,
  })
    .skip(Number(skip) ?? 0)
    .limit(limit as unknown as number)
    .populate("course");
  const courses = teachings.map((teaching) => teaching.course);

  // get all student enrollments for the courses the instructor is teaching
  const enrollments = await EnrollmentModel.find({
    course: { $in: courses },
    semester,
  })
    .populate("course")
    .populate("student");

  const totalTeachings = await InstructorTeachingModel.countDocuments({
    instructor: instructor._id,
    semester,
  });

  const response = {
    myTeachings: teachings,
    totalTeachings,
    enrolledStudents: enrollments,
  };

  return res.status(200).json(response);
};

export default getAuthenticatedInstructorTeachingsHandler;
