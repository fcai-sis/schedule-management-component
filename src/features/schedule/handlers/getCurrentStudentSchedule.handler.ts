import { TokenPayload } from "@fcai-sis/shared-middlewares";
import {
  EnrollmentModel,
  EnrollmentType,
  IEnrollment,
  LectureModel,
  SectionModel,
  StudentModel,
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

const getCurrentStudentScheduleHandler = async (
  req: HandlerRequest,
  res: Response
) => {
  const { user, semester } = req.body;
  const student = await StudentModel.findOne({ user: user.userId });

  if (!student)
    return res.status(404).json({ error: { message: "Student not found" } });

  const enrollments: IEnrollment[] = await EnrollmentModel.find({
    student: student._id,
    semester,
  });
  const courses = enrollments.map((enrollment) => enrollment.course);

  const lectures = await LectureModel.find({
    course: { $in: courses },
    semester,
  });
  const sections = await SectionModel.find({
    course: { $in: courses },
    semester,
  });

  return res.status(200).json({
    message: "Current Student Schedule",
    schedule: {
      lectures,
      sections,
    },
  });
};

export default getCurrentStudentScheduleHandler;
