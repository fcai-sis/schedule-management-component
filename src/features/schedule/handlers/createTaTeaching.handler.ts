import {
  TaTeachingModel,
  TaTeachingType,
  TeachingAssistantModel,
} from "@fcai-sis/shared-models";
import { Request, Response } from "express";
import { ObjectId } from "mongoose";

type HandlerRequest = Request<
  {},
  {},
  {
    taTeaching: Omit<TaTeachingType, "ta" | "semester">;
    email: string;
    course: string;
    semester: ObjectId;
  }
>;

const createTaTeachingHandler = async (req: HandlerRequest, res: Response) => {
  const { email, course, semester } = req.body;

  const ta = await TeachingAssistantModel.findOne({
    email,
  });

  if (!ta) {
    return res.status(404).json({
      error: {
        message: "TA not found",
      },
    });
  }

  const createdTaTeaching = await TaTeachingModel.create({
    semester,
    course,
    ta: ta._id,
  });

  const response = {
    message: "TA teaching created successfully",
    taTeaching: {
      id: createdTaTeaching._id,
      semester: createdTaTeaching.semester,
      course: createdTaTeaching.course,
      ta: createdTaTeaching.ta,
    },
  };

  return res.status(201).json(response);
};

export default createTaTeachingHandler;
