import { Role } from "@fcai-sis/shared-middlewares";
import {
  InstructorModel,
  InstructorTeachingModel,
  RoleEnumType,
  TaTeachingModel,
  TeachingAssistantModel,
} from "@fcai-sis/shared-models";
import { Request, Response, NextFunction } from "express";

type MiddlewareRequest = Request;

export default function ensureNotExistingTeachingMiddleware(
  role: RoleEnumType
) {
  return async (req: MiddlewareRequest, res: Response, next: NextFunction) => {
    switch (role) {
      case Role.INSTRUCTOR:
        const instructor = await InstructorModel.findOne({
          email: req.body.email,
        });

        if (!instructor) {
          return res.status(404).json({
            errors: [
              {
                message: "Instructor not found",
              },
            ],
          });
        }

        const instructorTeaching = await InstructorTeachingModel.findOne({
          instructor: instructor._id,
          semester: req.body.semester,
          course: req.body.course,
        });

        if (instructorTeaching) {
          return res.status(400).json({
            errors: [
              {
                message: "Instructor teaching already exists",
              },
            ],
          });
        }
        break;

      case Role.TEACHING_ASSISTANT:
        const ta = await TeachingAssistantModel.findOne({
          email: req.body.email,
        });

        if (!ta) {
          return res.status(404).json({
            errors: [
              {
                message: "TA not found",
              },
            ],
          });
        }

        const taTeaching = await TaTeachingModel.findOne({
          ta: ta._id,
          semester: req.body.semester,
          course: req.body.course,
        });

        if (taTeaching) {
          return res.status(400).json({
            errors: [
              {
                message: "TA teaching already exists",
              },
            ],
          });
        }
        break;
    }

    next();
  };
}
