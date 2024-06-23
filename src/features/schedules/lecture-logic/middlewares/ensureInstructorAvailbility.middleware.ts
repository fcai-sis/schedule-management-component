import { Request, Response, NextFunction } from "express";
import { InstructorTeachingModel, LectureModel } from "@fcai-sis/shared-models";


const ensureInstructorAvailbility = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { instructorTeaching, slot } = req.body;
  const instructorTeachingModel = await InstructorTeachingModel.findById(instructorTeaching);

  if (!instructorTeachingModel) {
    return res.status(400).json({ message: "Instructor teaching id not found" });
  }

  const semester = instructorTeachingModel.semester;
  const instructor = instructorTeachingModel.instructor;
  const teachingIds = await InstructorTeachingModel.find({ instructor, semester });
  const lectures = await LectureModel.find({ instructorTeaching: { $in: teachingIds.map((instructorTeaching) => instructorTeaching._id) } });
  for (const lecture of lectures) {
    if (lecture.slot.toString() === slot) {
      return res.status(400).json({ message: "Instructor is busy at this time" });
    }
  }
  next();
}

export default ensureInstructorAvailbility;