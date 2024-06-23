import { SectionModel, SectionType } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

type HandlerRequest = Request<
  {},
  {},
  {
    section: SectionType;
  }
>;

const handler = async (req: HandlerRequest, res: Response) => {
  const { section } = req.body;


  const createdSection = new SectionModel({
    groupName: section.groupName,
    schedule: section.schedule,
    hall: section.hall,
    slot: section.slot,
    taTeaching: section.taTeaching,

  });

  await createdSection.save();

  const response = {
    message: "Section created successfully",
    section: {
      ...createdSection.toObject(),
    },
  };

  return res.status(201).json(response);
};

const createSectionHandler = handler;

export default createSectionHandler;
