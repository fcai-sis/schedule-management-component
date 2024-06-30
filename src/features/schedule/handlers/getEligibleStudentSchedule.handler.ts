import { TokenPayload } from "@fcai-sis/shared-middlewares";
import {
  LectureModel,
  SectionModel,
  StudentModel,
} from "@fcai-sis/shared-models";
import { Request, Response } from "express";
import { ObjectId } from "mongoose";
import { formatLecture, formatSection } from "../utils";
import env from "../../../env";

type HandlerRequest = Request<
  {},
  {},
  {
    token: string;
    user: TokenPayload;
    semester: ObjectId;
  }
>;

const getEligibleStudentScheduleHandler = async (
  req: HandlerRequest,
  res: Response
) => {
  const { user, token, semester } = req.body;
  const student = await StudentModel.findOne({ user: user.userId });

  if (!student)
    return res.status(404).json({ error: { message: "Student not found" } });

  const { courses } = await fetch(`${env.ENROLLMENTS_API_URL}/eligible`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

  const coursesIds = courses.map((course: any) => course.course._id);

  const lectures = await LectureModel.find({
    course: { $in: coursesIds },
    semester,
  })
    .populate("course")
    .populate("hall")
    .populate("slot");

  console.log(lectures);

  const sections = await SectionModel.find({
    course: { $in: courses },
    semester,
  })
    .populate("course")
    .populate("hall")
    .populate("slot");

  return res.status(200).json({
    message: "Current Student Schedule",
    schedule: [
      ...lectures.map((lecture) => formatLecture(lecture)),
      ...sections.map((section) => formatSection(section)),
    ],
  });
};

export default getEligibleStudentScheduleHandler;
