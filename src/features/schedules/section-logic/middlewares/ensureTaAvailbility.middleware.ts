import { Request, Response, NextFunction } from "express";
import SectionModel from "../../data/models/section.model";
import { TaTeachingModel } from "@fcai-sis/shared-models";


const ensureTaAvailbility = async (
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
  const sections = await SectionModel.find({ teachingId: { $in: teachingIds.map((teachingId) => teachingId._id) } });
  for (const section of sections) {
    if (section.slotId.toString() === slotId) {
      return res.status(400).json({ message: "Ta is busy at this time" });
    }
  }
  next();
}

export default ensureTaAvailbility;