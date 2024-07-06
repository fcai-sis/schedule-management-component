import { TokenPayload } from "@fcai-sis/shared-middlewares";
import {
  IInstructorTeaching,
  InstructorModel,
  InstructorTeachingModel,
  LectureModel,
} from "@fcai-sis/shared-models";
import { Request, Response } from "express";
import { ObjectId } from "mongoose";
import { formatLecture } from "../utils";

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
    return res
      .status(404)
      .json({ errors: [{ message: "Instructor not found" }] });

  const teachings: IInstructorTeaching[] = await InstructorTeachingModel.find({
    instructor: instructor._id,
    semester,
  });
  const courses = teachings.map((teaching) => teaching.course);

  // return res.status(200).json({
  //   courses,
  // });

  const lectures = await LectureModel.find({
    course: { $in: courses },
    semester,
  })
    .populate("course")
    .populate("hall")
    .populate("slot");

  // return res.status(200).json({
  //   lectures,
  // });

  return res.status(200).json({
    schedule: [...lectures.map((lecture) => formatLecture(lecture))],
  });
};

export default getCurrentInstructorScheduleHandler;
