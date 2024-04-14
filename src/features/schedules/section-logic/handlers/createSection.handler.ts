import { Request, Response } from "express";
import SectionModel from "../../data/models/section.model";

type HandlerRequest = Request<
  {},
  {},
  {
    groupName: string;
    scheduleId: string;
    hallId: string;
    slotId: string;
    courseId: string;
    assistantId: string;
  }
>;


const handler = async (req: HandlerRequest, res: Response) => {
  const { groupName, scheduleId, hallId, slotId, courseId, assistantId } = req.body;

  const section = new SectionModel({
    groupName,
    scheduleId,
    hallId,
    slotId,
    courseId,
    assistantId
  });

  await section.save();
  const response = {
    message: "Section created successfully",
    section: {
      ...section.toObject(),
    },
  };

  return res.status(201).json(response);
};

const createSectionHandler = handler;

export default createSectionHandler;
