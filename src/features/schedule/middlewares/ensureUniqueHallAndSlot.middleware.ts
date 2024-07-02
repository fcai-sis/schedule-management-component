import {
  LectureModel,
  LectureType,
  SectionModel,
  SectionType,
} from "@fcai-sis/shared-models";
import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongoose";

type MiddlewareRequest = Request<
  {},
  {},
  | {
      lecture: Omit<LectureType, "semester">;
    }
  | {
      section: Omit<SectionType, "semester">;
    }
>;

export const ensureUniqueHallAndSlotMiddleware = async (
  req: MiddlewareRequest,
  res: Response,
  next: NextFunction
) => {
  let hall: ObjectId, slot: ObjectId;

  if ("lecture" in req.body) {
    const { lecture } = req.body;
    hall = lecture.hall;
    slot = lecture.slot;
  } else if ("section" in req.body) {
    const { section } = req.body;
    hall = section.hall;
    slot = section.slot;
  } else {
    return res.status(400).json({
      errors: [{ message: "Invalid request body" }],
    });
  }

  const [existingLecture, existingSection] = await Promise.all([
    LectureModel.findOne({ hall, slot }),
    SectionModel.findOne({ hall, slot }),
  ]);

  if (existingLecture)
    return res.status(400).json({
      errors: [
        {
          message: "Hall and slot already assigned to a lecture",
        },
      ],
    });

  if (existingSection)
    return res.status(400).json({
      errors: [
        {
          message: "Hall and slot already assigned to a lecture",
        },
      ],
    });

  next();
};

export default ensureUniqueHallAndSlotMiddleware;
