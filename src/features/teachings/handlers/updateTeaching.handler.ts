import {
  CourseModel,
  InstructorModel,
  InstructorTeachingModel,
  SemesterCourseModel,
  TeachingAssistantModel,
} from "@fcai-sis/shared-models";
import { Request, Response } from "express";

type HandlerRequest = Request<
  {},
  {},
  { id: string; courses: string[]; semester: string }
>;

export default async function updateTeachingHandler(
  req: HandlerRequest,
  res: Response
) {
  const { id, courses, semester } = req.body;

  const [instructor, ta] = await Promise.all([
    InstructorModel.findById(id),
    TeachingAssistantModel.findById(id),
  ]);

  if (!instructor && !ta)
    return res
      .status(404)
      .json({ errors: [{ message: "No instructor or TA found" }] });

  const courseIds = await SemesterCourseModel.aggregate([
    {
      $lookup: {
        from: CourseModel.collection.name,
        localField: "course",
        foreignField: "_id",
        as: "course",
      },
    },
    {
      $unwind: {
        path: "$course",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $match: {
        "course.code": { $in: courses },
        semester,
      },
    },
    {
      $project: {
        course: "$course._id",
      },
    },
  ]).then((courses) => courses.map((course) => course.course));

  if (courseIds.length !== courses.length)
    return res
      .status(404)
      .json({ errors: [{ message: "Some courses not found" }] });

  const Model = instructor ? InstructorTeachingModel : TeachingAssistantModel;

  await Model.deleteMany({
    instructor: id,
    semester,
  });

  const teachings = await Promise.all(
    courseIds.map((courseId) =>
      Model.create({
        ...(instructor ? { instructor: id } : { ta: id }),
        course: courseId,
        semester,
      })
    )
  );

  return res.status(200).json({ teachings });
}
