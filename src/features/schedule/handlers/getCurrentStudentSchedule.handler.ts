import { TokenPayload } from "@fcai-sis/shared-middlewares";
import {
  EnrollmentModel,
  IEnrollment,
  LectureModel,
  SectionModel,
  StudentModel,
} from "@fcai-sis/shared-models";
import { Request, Response } from "express";
import { ObjectId } from "mongoose";
import { formatLecture, formatSection } from "../utils";

type HandlerRequest = Request<
  {},
  {},
  {
    user: TokenPayload;
    semester: ObjectId;
  }
>;

/**
{
    slot: dummySlots[12],
    hall: dummyHalls[2],
    type: "lecture",
    lecture: {
      course: {
        code: "CS201",
        name: {
          en: "Data Structures and Algorithms",
          ar: "هياكل البيانات والخوارزميات",
        },
      },
      instructor: {
        fullName: "Dr. Jane Smith",
      },
    },
  },
  {
    slot: dummySlots[22],
    hall: dummyHalls[3],
    type: "section",
    secion: {
      group: "S1/S2",
      course: {
        code: "CS301",
        name: {
          en: "Software Engineering",
          ar: "هندسة البرمجيات",
        },
      },
      instructor: {
        fullName: "Dr. Mark Johnson",
      },
    },
  },
 */

const getCurrentStudentScheduleHandler = async (
  req: HandlerRequest,
  res: Response
) => {
  const { user, semester } = req.body;
  const student = await StudentModel.findOne({ user: user.userId });

  if (!student)
    return res.status(404).json({ errors: [{ message: "Student not found" }] });

  const enrollments: IEnrollment[] = await EnrollmentModel.find({
    student: student._id,
    semester,
  });
  const courses = enrollments.map((enrollment) => enrollment.course);

  const lectures = await LectureModel.find({
    course: { $in: courses },
    semester,
  })
    .populate("course")
    .populate("hall")
    .populate("slot");
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

export default getCurrentStudentScheduleHandler;
