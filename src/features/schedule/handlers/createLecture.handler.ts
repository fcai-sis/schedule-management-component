import { LectureModel, LectureType } from "@fcai-sis/shared-models";
import { Request, Response } from "express";
import { ObjectId } from "mongoose";

type HandlerRequest = Request<
  {},
  {},
  {
    lecture: Omit<LectureType, "semester">;
    course: ObjectId;
    semester: ObjectId;
  }
>;

const createLectureHandler = async (req: HandlerRequest, res: Response) => {
  const { lecture, course, semester } = req.body;

  const createdLecture = await LectureModel.create({
    hall: lecture.hall,
    course: course,
    slot: lecture.slot,
    semester,
  });

  const response = {
    message: "Lecture created successfully",
    lecture: {
      id: createdLecture._id,
      hall: createdLecture.hall,
      course: createdLecture.course,
      slot: createdLecture.slot,
    },
  };

  return res.status(201).json(response);
};

export default createLectureHandler;
