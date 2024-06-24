import { Request, Response } from "express";
import {
  ICourse,
  SemesterCourseModel,
  SemesterModel,
  SemesterType,
} from "@fcai-sis/shared-models";

type HandlerRequest = Request<
  {
    semesterId: string;
  },
  {},
  {
    semester: Partial<SemesterType>;
    courses?: string[];
  }
>;

/**
 * Update a semester object.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const semesterId = req.params.semesterId;
  const { semester, courses } = req.body;

  const updatedSemester = await SemesterModel.findByIdAndUpdate(
    semesterId,
    {
      ...(semester.year && { year: semester.year }),
      ...(semester.month && { month: semester.month }),
      ...(semester.season && { season: semester.season }),
    },
    { new: true, runValidators: true }
  );

  if (!updatedSemester) {
    return res.status(404).json({
      error: {
        message: "Semester not found",
      },
    });
  }

  if (courses && courses.length > 0) {
    // Delete all SemesterCourses related to the semester
    await SemesterCourseModel.deleteMany({ semester: semesterId });

    // Create new SemesterCourses
    await SemesterCourseModel.insertMany(
      courses.map((course) => ({
        semester: updatedSemester._id,
        course,
      }))
    );
  }

  const response = {
    message: "Semester updated successfully",
    semester: {
      ...updatedSemester.toObject(),
    },
  };

  return res.status(200).json(response);
};

const updateSemesterHandler = handler;

export default updateSemesterHandler;
