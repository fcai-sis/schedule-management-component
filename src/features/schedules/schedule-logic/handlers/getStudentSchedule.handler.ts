import { Request, Response } from "express";
import { TokenPayload } from "@fcai-sis/shared-middlewares";
import { StudentModel, SemesterModel, EnrollmentModel } from "@fcai-sis/shared-models";

import LectureModel from "../../data/models/lecture.model";
import SectionModel from "../../data/models/section.model";
import TaTeachingModel from "../../data/models/taTeaching.model";
import InstructorTeachingModel from "../../data/models/instructorTeaching.model";
import logger from "../../../../core/logger";

type HandlerRequest = Request<{}, {}, { user: TokenPayload; }>

/**
 * Get the student's schedule, lectures and sections
 */
const getStudentScheduleHandler = async (req: HandlerRequest, res: Response) => {
  logger.info(`getStudentScheduleHandler ${JSON.stringify(req.body)} ${JSON.stringify(req.headers)}`);

  const { user: { id: userId } } = req.body;

  // Find the latest semseter, sort by createdAt and get the first result
  const currentSemester = await SemesterModel.findOne().sort('-createdAt');

  if (!currentSemester) {
    res.status(500).json({ error: "wtf" });
    return;
  }

  const semesterId = currentSemester!._id.toString();

  // Find the student
  const student = await StudentModel.findOne({ userId });

  if (!student) {
    res.status(404).json({ error: "Student not found" });
    return;
  }

  // Find the student's enrollments
  const enrollments = await EnrollmentModel.find({ studentId: student._id, semesterId });

  // Find the lectures and sections teachings
  const instructorTeachings = await InstructorTeachingModel.find({ semesterId, courseId: { $in: enrollments.map(e => e.courseId) } });
  const taTeachings = await TaTeachingModel.find({ semesterId, courseId: { $in: enrollments.map(e => e.courseId) } });

  // Find the lectures and sections
  const lectures = await LectureModel.find({ teachingId: { $in: instructorTeachings.map(t => t._id) } });
  const sections = await SectionModel.find({ teachingId: { $in: taTeachings.map(t => t._id) } });

  res.json({
    lectures,
    sections,
  });
};

export default getStudentScheduleHandler;
