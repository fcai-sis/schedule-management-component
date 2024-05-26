import { Request, Response, NextFunction } from "express";
import { SemesterModel } from "@fcai-sis/shared-models";

const checkCourseAvailabilityMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { courseId } = req.query;
    const semester = await SemesterModel.findOne({}).sort({ createdAt: -1 });

    if (!courseId) {
        // If courseId is not provided in the request query, skip the check
        return next();
    }

    if (!semester) {
        return res.status(404).json({ message: "Semester not found" });
    }

    const courseExists = semester.courseIds.includes(courseId);

    if (!courseExists) {
        return res.status(404).json({ message: "Course not available in this semester" });
    }

    next();
}

export default checkCourseAvailabilityMiddleware;