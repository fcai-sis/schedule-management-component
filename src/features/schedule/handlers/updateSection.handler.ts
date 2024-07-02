import { SectionModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

type HandlerRequest = Request<
  {
    sectionId: string;
  },
  {},
  {
    scheduleId?: string;
    hallId?: string;
    slotId?: string;
    teachingId?: string;
  }
>;

/**
 * Update a section object.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const sectionId = req.params.sectionId;

  const { scheduleId, hallId, slotId, teachingId } = req.body;

  const section = await SectionModel.findByIdAndUpdate(
    sectionId,
    {
      ...(scheduleId && { scheduleId }),
      ...(hallId && { hallId }),
      ...(slotId && { slotId }),
      ...(teachingId && { teachingId }),
    },
    { new: true }
  );

  if (!section) {
    return res.status(404).json({
      errors: [
        {
          message: "Section not found",
        },
      ],
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
