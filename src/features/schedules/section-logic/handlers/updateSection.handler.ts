import { Request, Response } from "express";
import SectionModel from "../../data/models/section.model";


type HandlerRequest = Request<
  {
    sectionId: string;
  },
  {},
  {
    scheduleId?: string;
    hallId?: string;
    slotId?: string;
    courseId?: string;
    assistantId?: string;
  }
>;

/**
 * Update a section object.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const sectionId = req.params.sectionId;

  const section = await SectionModel.findByIdAndUpdate(
    sectionId,
    { ...req.body },
    { new: true }
  );

  if (!section) {
    return res.status(404).json({
      error: {
        message: "Section not found",
      },
    });
  }

  const response = {
    message: "Section updated successfully",
    section: {
      ...section.toObject(),
    },
  };

  return res.status(200).json(response);
};

const updateSectionHandler = handler;

export default updateSectionHandler;
