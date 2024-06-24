import { SectionModel, TaTeachingModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

type HandlerRequest = Request<{ taTeachingId: string }, {}, {}>;

/**
 * Delete a Ta teaching by its id.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const taTeachingId = req.params.taTeachingId;

  try {
    // Find and delete the Ta teaching
    const taTeaching = await TaTeachingModel.findById(taTeachingId);
    if (!taTeaching) {
      return res.status(404).json({
        error: {
          message: "Ta teaching not found",
        },
      });
    }

    // Delete related lectures
    await SectionModel.deleteMany({ taTeaching: taTeachingId });

    // Delete the Ta teaching
    await taTeaching.delete();

    const response = {
      message: "Ta teaching and related lectures deleted successfully",
      taTeaching: {
        ...taTeaching.toObject(),
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error deleting Ta teaching and related lectures:", error);
    return res.status(500).json({
      error: {
        message: "Internal server error",
      },
    });
  }
};

const deleteTaTeachingHandler = handler;

export default deleteTaTeachingHandler;
