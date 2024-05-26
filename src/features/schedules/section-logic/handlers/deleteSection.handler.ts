import { Request, Response } from "express";
import SectionModel from "../../data/models/section.model";


type HandlerRequest = Request<
  {
    sectionId: string;
  },
  {},
  {}
>;

/**
 * delete a section object.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const sectionId = req.params.sectionId;

  const section = await SectionModel.findById(sectionId);

  if (!section) {
    return res.status(404).json({
      error: {
        message: "Section not found",
      },
    });
  }

  const deletedSection = await section.deleteOne();

  if (!deletedSection) {
    return res.status(500).json({
      error: {
        message: "Failed to delete section",
      },
    });
  }

  const response = {
    message: "Section deleted successfully",
    section: {
      ...section.toObject(),
    },
  };

  return res.status(200).json(response);
};

const deleteSectionHandler = handler;

export default deleteSectionHandler;