import { TokenPayload } from "@fcai-sis/shared-middlewares";
import { LectureModel, SectionModel } from "@fcai-sis/shared-models";
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

const getEntireScheduleHandler = async (req: HandlerRequest, res: Response) => {
  const { semester } = req.body;

  const lectures = await LectureModel.find({
    semester,
  })
    .populate("course")
    .populate("hall")
    .populate("slot");
  const sections = await SectionModel.find({
    semester,
  })
    .populate("course")
    .populate("hall")
    .populate("slot");

  const response = {
    schedule: [
      ...lectures.map((lecture) => formatLecture(lecture)),
      ...sections.map((section) => formatSection(section)),
    ],
  };

  console.log(response);

  return res.status(200).json(response);
};

export default getEntireScheduleHandler;
