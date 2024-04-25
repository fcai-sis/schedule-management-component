import { Request, Response, NextFunction } from "express";
import InstructorTeachingModel from "../../data/models/instructorTeaching.model";
import LectureModel from "../../data/models/lecture.model";
import LectureTeachingsModel from "../../data/models/lectureTeachings.model";


const ensureInstructorAvailbility = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { instructorTeachingId, slotId, courseId } = req.body;
  const teachingId = await InstructorTeachingModel.findById(instructorTeachingId);

  if (!teachingId) {
    return res.status(400).json({ message: "Instructor teaching id not found" });
  }

  if (teachingId.courseId.toString() !== courseId) {
    return res.status(400).json({ message: "Course id does not match" });
  }

  const semesterId = teachingId.semesterId;
  const instructorId = teachingId.instructorId;
  const teachingIds = await InstructorTeachingModel.find({ instructorId, semesterId });
  for (const teachingId of teachingIds) {
    const lectureTeachings = await LectureTeachingsModel.find({
      taTeachingId: teachingId._id,
    });
    for (const lectureTeaching of lectureTeachings) {
      const lectureData = await LectureModel.findById(lectureTeaching.lectureId);
      if (lectureData && lectureData.slotId.toString() === slotId) {
        return res.status(400).json({ message: "Instructor is busy at this time" });
      }
    }
  }
  next();
}

export default ensureInstructorAvailbility;