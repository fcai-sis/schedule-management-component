import { TokenPayload } from "@fcai-sis/shared-middlewares";
import {
  ITaTeaching,
  SectionModel,
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

const getCurrentTaScheduleHandler = async (
  req: HandlerRequest,
  res: Response
) => {
  const { user, semester } = req.body;
  const ta = await TeachingAssistantModel.findOne({ user: user.userId });

  if (!ta) return res.status(404).json({ error: { message: "TA not found" } });

  const teachings: ITaTeaching[] = await TaTeachingModel.find({
    ta: ta._id,
    semester,
  });
  const courses = teachings.map((teaching) => teaching.course);

  const sections = await SectionModel.find({
    course: { $in: courses },
    semester,
  });

  return res.status(200).json({
    message: "Current Student Schedule",
    schedule: {
      sections,
    },
  });
};

export default getCurrentTaScheduleHandler;
