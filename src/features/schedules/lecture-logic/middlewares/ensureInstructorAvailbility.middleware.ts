import { Request, Response, NextFunction } from "express";
import { InstructorTeachingModel, LectureModel } from "@fcai-sis/shared-models";

const ensureInstructorAvailbility = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { lecture } = req.body;
  const instructorTeachingModel = await InstructorTeachingModel.findById(
    lecture.instructorTeaching
  );

  if (!instructorTeachingModel) {
    return res.status(400).json({
      error: {
        message: "Instructor teaching not found",
      },
    });
  }

  const semester = instructorTeachingModel.semester;
  const instructor = instructorTeachingModel.instructor;
  const teachingIds = await InstructorTeachingModel.find({
    instructor,
    semester,
  });
  const lectures = await LectureModel.find({
    instructorTeaching: {
      $in: teachingIds.map((instructorTeaching) => instructorTeaching._id),
    },
  });
  for (const lectureData of lectures) {
    if (lectureData.slot.toString() === lecture.slot.toString()) {
      return res.status(400).json({
        error: {
          message: "Instructor is not available at this slot",
        },
      });
    }
  }
  next();
};

export default ensureInstructorAvailbility;
