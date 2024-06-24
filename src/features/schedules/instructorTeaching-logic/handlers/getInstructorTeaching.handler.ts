import { InstructorTeachingModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

type HandlerRequest = Request<
  {},
  {},
  {},
  {
    instructor?: string;
    course?: string;
    semester?: string;
  }
>;

const handler = async (req: HandlerRequest, res: Response) => {
  const { instructor, course, semester } = req.query;

  const query = {
    ...(instructor && { instructor }),
    ...(course && { course }),
    ...(semester && { semester }),
  };

  const instructorTeaching = await InstructorTeachingModel.find(query)
    .populate("instructor")
    .populate("course")
    .populate("semester");

  const response = {
    instructorTeaching: instructorTeaching.map((instructorTeaching) =>
      instructorTeaching.toObject()
    ),
  };

  return res.status(200).json(response);
};

const getInstructorTeachingHandler = handler;
export default getInstructorTeachingHandler;
