import {
  AcademicStudentModel,
  BylawModel,
  IStudent,
  SemesterModel,
  StudentSemesterModel,
} from "@fcai-sis/shared-models";
import { Request, Response } from "express";
import { ObjectId } from "mongoose";

type HandlerRequest = Request<
  {},
  {},
  {
    semester: ObjectId;
  }
>;

const startSemesterHandler = async (req: HandlerRequest, res: Response) => {
  const { semester } = req.body;
  // still not sure what to do here

  const response = {
    message: "Semester Started",
  };

  return res.status(200).json(response);
};

export default startSemesterHandler;
