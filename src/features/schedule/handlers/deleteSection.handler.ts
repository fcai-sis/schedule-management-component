import { SectionModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

type HandlerRequest = Request<{ sectionId: string }, {}, {}>;

/**
 * Delete a Section by its id.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const sectionId = req.params.sectionId;

  const section = await SectionModel.findByIdAndDelete(sectionId);

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
    message: "Section deleted successfully",
    section: {
      ...section.toObject(),
    },
  };

  return res.status(200).json(response);
};

const deleteSectionHandler = handler;
export default deleteSectionHandler;
