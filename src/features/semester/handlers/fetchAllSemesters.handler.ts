import { Request, Response } from "express";
import {
  ISemester,
  SemesterCourseModel,
  SemesterModel,
  SemesterType,
} from "@fcai-sis/shared-models";

type HandlerRequest = Request;

/**
 * Get all available semesters.
 */
const fetchAllSemesterHandler = async (req: HandlerRequest, res: Response) => {
  const semesters = await SemesterModel.aggregate([
    // lookup to get the courses of the semester from the SemesterCourseModel
    // and populate the course field with the course data
    {
      $lookup: {
        from: SemesterCourseModel.collection.name,
        localField: "_id",
        foreignField: "semester",
        as: "course",
      },
    },
    // unwind the course array to get the course data
    {
      $unwind: {
        path: "$course",
        preserveNullAndEmptyArrays: true,
      },
    },
    // group the data to get the semester data
    {
      $group: {
        _id: "$_id",
        season: { $first: "$season" },
        course: { $push: "$course" },
      },
    },
    // project the data to get the semester data
    {
      $project: {
        _id: 1,
        season: 1,
        course: 1,
      },
    },
  ]);

  return res.status(200).send({
    semesters: semesters.map((semester) => ({
      id: semester._id,
      semesterType: semester.season,
      courses: semester.course.map((course: any) => ({
        id: course._id,
        name: course.name,
        code: course.code,
        creditHours: course.creditHours,
        type: course.type,
      })),
    })),
  });
};

export default fetchAllSemesterHandler;
