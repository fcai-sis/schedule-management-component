import { SectionModel, SectionType } from "@fcai-sis/shared-models";
import { Request, Response } from "express";


type HandlerRequest = Request<
  {
    sectionId: string;
  },
  {},
  {
    section: Partial<SectionType>;
  }
>;

/**
 * Update a section object.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const sectionId = req.params.sectionId;
  const { section } = req.body;

  const updatedSection = await SectionModel.findByIdAndUpdate(
    sectionId,
    {
      ...(section.groupName && { groupName: section.groupName }),
      ...(section.schedule && { schedule: section.schedule }),
      ...(section.hall && { hall: section.hall }),
      ...(section.slot && { slot: section.slot }),
      ...(section.taTeaching && { taTeaching: section.taTeaching }),
    },
    { new: true }
  );

  if (!updatedSection) {
    return res.status(404).json({
      error: {
        message: "Section not found",
      },
    });
  }

  const response = {
    message: "Section updated successfully",
    section: {
      ...updatedSection.toObject(),
    },
  };

  return res.status(200).json(response);
};

const updateSectionHandler = handler;

export default updateSectionHandler;
