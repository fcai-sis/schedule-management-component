import { Request, Response, NextFunction } from "express";
import SectionModel from "features/schedules/data/models/section.model";


const ensureInstructor = async (req: Request, res: Response, next: NextFunction) => {
    const { instructorId, slotId } = req.body;
    const existingSection = await SectionModel.findOne({ instructorId, slotId });
    if (existingSection) {
      return res.status(400).json({ message: "Instructor already assigned to a section in same slot" });
    }
    next();
}

export default ensureInstructor;