import { TokenPayload } from "@fcai-sis/shared-middlewares";
import {
  IInstructorTeaching,
  InstructorModel,
  InstructorTeachingModel,
  LectureModel,
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

const getCurrentInstructorScheduleHandler = async (
  req: HandlerRequest,
  res: Response
) => {
  const { user, semester } = req.body;
  const instructor = await InstructorModel.findOne({ user: user.userId });

  if (!instructor)
    return res.status(404).json({ error: { message: "Instructor not found" } });

  const teachings: IInstructorTeaching[] = await InstructorTeachingModel.find({
    instructor: instructor._id,
    semester,
  });
  const courses = teachings.map((teaching) => teaching.course);

  const lectures = await LectureModel.find({
    course: { $in: courses },
    semester,
  });

  return res.status(200).json({
    message: "Current Student Schedule",
    schedule: {
      lectures,
    },
  });
};

export default getCurrentInstructorScheduleHandler;
