import { Request, Response, NextFunction } from "express";
import { InstructorTeachingModel, LectureModel } from "@fcai-sis/shared-models";


const ensureInstructorAvailbility = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { instructorTeachingId, slotId, courseId } = req.body;
  const instructorTeaching = await InstructorTeachingModel.findById(instructorTeachingId);

  if (!instructorTeaching) {
    return res.status(400).json({ message: "Instructor teaching id not found" });
  }

  if (instructorTeaching.courseId.toString() !== courseId) {
    return res.status(400).json({ message: "Course id does not match" });
  }

  const semesterId = instructorTeaching.semesterId;
  const instructorId = instructorTeaching.instructorId;
  const teachingIds = await InstructorTeachingModel.find({ instructorId, semesterId });
  const lectures = await LectureModel.find({ teachingId: { $in: teachingIds.map((teachingId) => teachingId._id) } });
  for (const lecture of lectures) {
    if (lecture.slotId.toString() === slotId) {
      return res.status(400).json({ message: "Instructor is busy at this time" });
    }
  }
  next();
}

export default ensureInstructorAvailbility;