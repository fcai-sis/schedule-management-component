import { TokenPayload } from "@fcai-sis/shared-middlewares";
import {
  EnrollmentModel,
  ITaTeaching,
  TaTeachingModel,
  TeachingAssistantModel,
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

const getAuthenticatedTaTeachingsHandler = async (
  req: HandlerRequest,
  res: Response
) => {
  const { user, semester } = req.body;
  const ta = await TeachingAssistantModel.findOne({ user: user.userId });

  if (!ta)
    return res.status(404).json({ errors: [{ message: "TA not found" }] });

  const teachings: ITaTeaching[] = await TaTeachingModel.find({
    ta: ta._id,
    semester,
  }).populate("course");
  const courses = teachings.map((teaching) => teaching.course);

  // get all student enrollments for the courses the ta is teaching
  const enrollments = await EnrollmentModel.find({
    course: { $in: courses },
    semester,
  })
    .populate("course")
    .populate("student");

  const response = {
    myTeachings: teachings,
    enrolledStudents: enrollments,
  };

  return res.status(200).json(response);
};

export default getAuthenticatedTaTeachingsHandler;
