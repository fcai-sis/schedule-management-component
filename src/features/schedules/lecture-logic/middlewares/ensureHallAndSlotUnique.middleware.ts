import { NextFunction, Request, Response } from "express";

import LectureModel from "../../data/models/lecture.model";
import SectionModel from "../../data/models/section.model";

export const ensureHallAndSlotUniqueMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { hallId, slotId } = req.body;
  const existingLecture = await LectureModel.findOne({ hallId, slotId });
  if (existingLecture) {
    return res.status(400).json({ message: "Hall and slot already assigned to a lecture" });
  }

  const existingSection = await SectionModel.findOne({ hallId, slotId });
  if (existingSection) {
    return res.status(400).json({ message: "Hall and slot already assigned to a section" });
  }
  next();
}

export default ensureHallAndSlotUniqueMiddleware;
