import { Request, Response, NextFunction } from "express";
import { SectionModel, TaTeachingModel } from "@fcai-sis/shared-models";


const ensureTaAvailbility = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { section } = req.body;
  const teachingId = await TaTeachingModel.findById(section.taTeaching);

  if (!teachingId) {
    return res.status(400).json({ message: "Ta teaching id not found" });
  }

  if (teachingId.courseId.toString() !== section.course) {
    return res.status(400).json({ message: "Course id does not match" });
  }

  const semester = teachingId.semester;
  const ta = teachingId.ta;
  const teachingIds = await TaTeachingModel.find({ ta, semester });
  const sections = await SectionModel.find({ taTeaching: { $in: teachingIds.map((taTeaching) => taTeaching._id) } });
  for (const section of sections) {
    if (section.slot.toString() === section.slot) {
      return res.status(400).json({ message: "Ta is busy at this time" });
    }
  }
  next();
}

export default ensureTaAvailbility;