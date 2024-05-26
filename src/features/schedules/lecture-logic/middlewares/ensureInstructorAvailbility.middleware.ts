import { Request, Response, NextFunction } from "express";
import { InstructorTeachingModel, LectureModel } from "@fcai-sis/shared-models";


const ensureInstructorAvailbility = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { teachingId, slotId } = req.body;
  const instructorTeaching = await InstructorTeachingModel.findById(teachingId);

  if (!instructorTeaching) {
    return res.status(400).json({ message: "Instructor teaching id not found" });
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