import { Request, Response, NextFunction } from "express";
import SectionModel from "../../data/models/section.model";
import TaTeachingModel from "../../data/models/taTeaching.model";
import sectionTeachingsModel from "features/schedules/data/models/sectionTeachings.model";


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
    const sections = await sectionTeachingsModel.find({
      taTeachingId: teachingId._id,
    });
    for (const section of sections) {
      const sectionData = await SectionModel.findById(section.sectionId);
      if (sectionData && sectionData.slotId.toString() === slotId) {
        return res.status(400).json({ message: "TA is busy at this time" });
      }
    }
  }
  next();
}

export default ensureTA;