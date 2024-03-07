import { Request, Response } from "express";
import SectionModel from "features/schedules/data/models/section.model";

type HandlerRequest = Request<{ sectionId: string }, {}, {}>;

/**
 * Get a Section by its id.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const sectionId = req.params.sectionId;

  const section = await SectionModel.findById(sectionId)
  .populate("courseId")
  .populate("assistantId")
  .populate("hallId")
  .populate("slotId")
  .populate("scheduleId");

  if (!section) {
    return res.status(404).json({
      error: {
        message: "Section not found",
      },
    });
  }

  const response = {
    section: {
      ...section.toObject(),
    },
  };

  return res.status(200).json(response);
}

const getSectionByIdHandler = handler;
export default getSectionByIdHandler;