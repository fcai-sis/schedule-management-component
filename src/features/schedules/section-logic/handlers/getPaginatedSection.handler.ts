import { Request, Response } from "express";
import SectionModel from "../../data/models/section.model";

// get section filtered by scheduleId or courseId or assistantId or hallId or slotId

type HandlerRequest = Request<
  {
    scheduleId?: string;
    courseId?: string;
    hallId?: string;
    slotId?: string;
  },
  {},
  {}
>;


const handler = async (req: HandlerRequest, res: Response) => {
  const { scheduleId, courseId, hallId, slotId } = req.query;
  const page = req.context.page;
  const pageSize = req.context.pageSize;

  const query = {
    ...(scheduleId && { scheduleId }),
    ...(courseId && { courseId }),
    ...(hallId && { hallId }),
    ...(slotId && { slotId }),
  };
  const sections = await SectionModel.find(query)
  .populate("courseId")
  .populate("hallId")
  .populate("slotId")
  .populate("scheduleId")
  .skip((page - 1) * pageSize)
  .limit(pageSize);

  const count = await SectionModel.countDocuments(query);
  const totalPages = Math.ceil(count / pageSize);
  

  const response = {
    sections: sections.map((section) => section.toObject()),
    count,
    totalPages,
    currentPage: page,
    pageSize: pageSize
  };

  return res.status(200).json(response);
};

const getPaginatedSectionHandler = handler;
export default getPaginatedSectionHandler;