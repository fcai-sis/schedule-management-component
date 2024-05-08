import { Request, Response } from "express";
import { Role, TokenPayload } from "@fcai-sis/shared-middlewares";
import { InstructorModel, TeacherAssistantModel, SemesterModel } from "@fcai-sis/shared-models";

import LectureModel from "../../data/models/lecture.model";
import SectionModel from "../../data/models/section.model";
import TaTeachingModel from "../../data/models/taTeaching.model";
import InstructorTeachingModel from "../../data/models/instructorTeaching.model";

type HandlerRequest = Request<{}, {}, { user: TokenPayload; }>

/**
 * Get the custom schedule for the user based on their role, either instructor or TA
 */
const getCustomTeachingScheduleHandler = async (req: HandlerRequest, res: Response) => {
  const { user: { userId, role } } = req.body;

  // Find the latest semseter, sort by createdAt and get the first result
  const currentSemester = await SemesterModel.findOne().sort('-createdAt');

  if (!currentSemester) {
    res.status(500).json({ error: "wtf" });
    return;
  }

  const semesterId = currentSemester!._id.toString();

  // Get the instructor/TA/Student _id depending on the role
  switch (role) {
    case Role.INSTUCTOR:
      const instructor = await InstructorModel.findOne({ userId });

      if (!instructor) {
        res.status(404).send("Instructor not found");
        return
      }

      const instructorId = instructor._id.toString();

      res.status(200).json(await getInstructorSchedule(instructorId, semesterId));
      break;

    case Role.TEACHING_ASSISTANT:
      const ta = await TeacherAssistantModel.findOne({ userId });

      if (!ta) {
        res.status(404).send("TA not found");
        return
      }

      const TAId = ta._id.toString();

      res.status(200).json(await getTASchedule(TAId, semesterId));
      break;

    default:
      res.status(401).send("Invalid role");

      break;
  }

};

export default getCustomTeachingScheduleHandler;

async function getInstructorSchedule(instructorId: string, semesterId: string) {
  const instructorTeachings = await InstructorTeachingModel.find({ instructorId, semesterId });
  const instructorTeachingsIds = instructorTeachings.map(({ _id }) => _id);

  if (instructorTeachings.length == 0) return { error: "No lectures" };
  const lectures = await LectureModel.find({ teachingId: { $in: instructorTeachingsIds } });

  return lectures;
}

async function getTASchedule(TAId: string, semesterId: string) {
  const taTeachings = await TaTeachingModel.find({ taId: TAId, semesterId });
  const taTeachingsIds = taTeachings.map(({ _id }) => _id);

  if (taTeachings.length == 0) return { error: "No Sections" };
  const sections = await SectionModel.find({ teachingId: { $in: taTeachingsIds } });

  return sections;
}

