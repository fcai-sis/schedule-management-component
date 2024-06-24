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
    return res.status(400).json({
      error: {
        message: "Ta teaching not found",
      },
    });
  }

  if (teachingId.courseId.toString() !== section.course) {
    return res.status(400).json({
      error: {
        message: "Ta teaching and section course not match",
      },
    });
  }

  const semester = teachingId.semester;
  const ta = teachingId.ta;
  const teachingIds = await TaTeachingModel.find({ ta, semester });
  const sections = await SectionModel.find({
    taTeaching: { $in: teachingIds.map((taTeaching) => taTeaching._id) },
  });
  for (const sectionData of sections) {
    if (sectionData.slot.toString() === section.slot.toString()) {
      return res.status(400).json({
        error: {
          message: "Ta is not available at this slot",
        },
      });
    }
  }
  next();
};

export default ensureTaAvailbility;
