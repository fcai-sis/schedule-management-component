import { Request, Response } from "express";
import {
  CourseModel,
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
    season?: string;
    courses?: string[];
  }
>;

/**
 * Update a semester object.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const semesterId = req.params.semesterId;
  const { season, courses } = req.body;

  const updatedSemester = await SemesterModel.findByIdAndUpdate(
    semesterId,
    { ...(season && { season }) },
    { new: true, runValidators: true }
  );

  if (!updatedSemester) {
    return res.status(404).json({
      error: {
        message: "Semester not found",
      },
    });
  }

  const updatedSemesterCourses = await SemesterCourseModel.find({
    semester: semesterId,
  });

  if (courses) {
    const coursesData = await CourseModel.find({
      code: { $in: courses },
    });

    const coursesToAdd = coursesData.filter(
      (course) =>
        !updatedSemesterCourses.find(
          (semesterCourse) =>
            semesterCourse.course.toString() === course._id.toString()
        )
    );

    const coursesToRemove = updatedSemesterCourses.filter(
      (semesterCourse) =>
        !coursesData.find(
          (course) => course._id.toString() === semesterCourse.course.toString()
        )
    );

    await SemesterCourseModel.deleteMany({
      _id: { $in: coursesToRemove.map((course) => course._id) },
    });

    await SemesterCourseModel.insertMany(
      coursesToAdd.map((course) => ({
        semester: updatedSemester._id,
        course: course._id,
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
