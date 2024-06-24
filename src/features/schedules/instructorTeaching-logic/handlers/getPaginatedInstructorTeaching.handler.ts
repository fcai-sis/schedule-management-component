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
    limit?: number;
    page?: number;
  }
>;

const handler = async (req: HandlerRequest, res: Response) => {
  const { instructor, course, semester } = req.query;

  const query = {
    ...(instructor && { instructor }),
    ...(course && { course }),
    ...(semester && { semester }),
  };
  const instructorTeaching = await InstructorTeachingModel.find(
    query,
    {
      _v: 0,
    },
    {
      skip: req.skip ?? 0,
      limit: req.query.limit as unknown as number,
    }
  );

  const count = await InstructorTeachingModel.countDocuments(query);
  const totalPages = Math.ceil(count / (req.query.limit as unknown as number));

  const response = {
    lectures: instructorTeaching.map((instructorTeaching) =>
      instructorTeaching.toObject()
    ),
    count,
    totalPages,
    currentPage: req.query.page as unknown as number,
    pageSize: req.query.limit as unknown as number,
  };

  return res.status(200).json(response);
};

const getPaginatedInstructorTeachingHandler = handler;
export default getPaginatedInstructorTeachingHandler;
