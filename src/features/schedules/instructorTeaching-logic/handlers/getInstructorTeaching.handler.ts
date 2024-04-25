import { Request, Response } from "express";
import InstructorTeachingModel from "../../data/models/instructorTeaching.model";


type HandlerRequest = Request<
  {
    instructorId?: string;
    courseId?: string;
    semesterId?: string;
  },
  {},
  {}
>;


const handler = async (req: HandlerRequest, res: Response) => {
  const { instructorId, courseId, semesterId } = req.query;

  const query = {
    ...(instructorId && { instructorId }),
    ...(courseId && { courseId }),
    ...(semesterId && { semesterId }),
  };

  const instructorTeaching = await InstructorTeachingModel.find(query)
  .populate("instructorId")
    .populate("courseId")
    .populate("semesterId");


  const response = {
    instructorTeaching: instructorTeaching.map((instructorTeaching) => instructorTeaching.toObject()),
  };

  return res.status(200).json(response);
};

const getInstructorTeachingHandler = handler;
export default getInstructorTeachingHandler;