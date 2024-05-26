import { Request, Response } from "express";
import SectionModel from "../../data/models/section.model";

type HandlerRequest = Request<
  {},
  {},
  {
    scheduleId: string;
    hallId: string;
    slotId: string;
    teachingId: string;
  }
>;

const handler = async (req: HandlerRequest, res: Response) => {
  const { scheduleId, hallId, slotId, teachingId } = req.body;


  const section = new SectionModel({
    scheduleId,
    hallId,
    slotId,
    teachingId
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
