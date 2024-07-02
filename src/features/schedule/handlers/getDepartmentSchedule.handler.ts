import {
  CourseDepartmentModel,
  DepartmentModel,
  LectureModel,
  SectionModel,
} from "@fcai-sis/shared-models";
import { Request, Response } from "express";
import { ObjectId } from "mongoose";

type HandlerRequest = Request<
  {},
  {},
  {
    semester: ObjectId;
    departmentCode: string;
  }
>;

const getDepartmentScheduleHandler = async (
  req: HandlerRequest,
  res: Response
) => {
  const { departmentCode, semester } = req.body;

  const department = await DepartmentModel.findOne({ code: departmentCode });

  if (!department)
    return res
      .status(404)
      .json({ errors: [{ message: "Department not found" }] });

  const departmentCourses = await CourseDepartmentModel.find({
    department: department._id,
  });

  const lectures = await LectureModel.find({
    courses: { $in: departmentCourses },
    semester,
  });
  const sections = await SectionModel.find({
    courses: { $in: departmentCourses },
    semester,
  });

  return res.status(200).json({
    message: "Current Department Schedule",
    schedule: {
      lectures,
      sections,
    },
  });
};

export default getDepartmentScheduleHandler;
