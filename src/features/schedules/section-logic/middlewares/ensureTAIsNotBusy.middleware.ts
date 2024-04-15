import { Request, Response, NextFunction } from "express";
import SectionModel from "../../data/models/section.model";
import TaTeachingModel from "../../data/models/taTeaching.model";


const ensureTA = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { taTeachingId, slotId, courseId } = req.body;
  const teachingId = await TaTeachingModel.findById(taTeachingId);

  if (!teachingId) {
    return res.status(400).json({ message: "Ta teaching id not found" });
  }

  if (teachingId.courseId.toString() !== courseId) {
    return res.status(400).json({ message: "Course id does not match" });
  }

  const semesterId = teachingId.semesterId;
  const taId = teachingId.taId;
  const teachingIds = await TaTeachingModel.find({ taId, semesterId });
  for (const teachingId of teachingIds) {
    const section = await SectionModel.findOne({ slotId, TaTeachingId: teachingId._id });
    if (section) {
      return res.status(400).json({ message: "TA is busy at this time" });
    }
  }
  next();
}

export default ensureTA;