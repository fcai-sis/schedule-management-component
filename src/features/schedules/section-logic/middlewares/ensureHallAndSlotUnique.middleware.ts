import { LectureModel, SectionModel } from "@fcai-sis/shared-models";
import { NextFunction, Request, Response } from "express";

export const ensureHallAndSlotUniqueMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { section } = req.body;
    const existingLecture = await LectureModel.findOne({ hall: section.hall, slot: section.slot });
    if (existingLecture) {
      return res.status(400).json({ message: "Hall and slot already assigned to a lecture" });
    }

    const existingSection = await SectionModel.findOne({ hall: section.hall, slot: section.slot });
    if (existingSection) {
      return res.status(400).json({ message: "Hall and slot already assigned to a section" });
    }
    next();
}

export default ensureHallAndSlotUniqueMiddleware;