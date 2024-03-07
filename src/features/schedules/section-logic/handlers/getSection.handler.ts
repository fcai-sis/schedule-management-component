import { Request, Response } from "express";
import SectionModel from "../../data/models/section.model";

// get Section filtered by scheduleId or courseId or assistantId or hallId or slotId

type HandlerRequest = Request<
  {
    scheduleId?: string;
    courseId?: string;
    assistantId?: string;
    hallId?: string;
    slotId?: string;
  },
  {},
  {}
>;


const handler = async (req: HandlerRequest, res: Response) => {
  const { scheduleId, courseId, assistantId, hallId, slotId } = req.query;

  const query = {
    ...(scheduleId && { scheduleId }),
    ...(courseId && { courseId }),
    ...(assistantId && { assistantId }),
    ...(hallId && { hallId }),
    ...(slotId && { slotId }),
  };

  const sections = await SectionModel.find(query)
    .populate("courseId")
    .populate("assistantId")
    .populate("hallId")
    .populate("slotId")
    .populate("scheduleId");


  const response = {
    sections: sections.map((section) => section.toObject()),
  };

  return res.status(200).json(response);
};

const getSectionHandler = handler;
export default getSectionHandler;