import { Request, Response } from "express";
import TaTeachingModel from "../../data/models/taTeaching.model";

type HandlerRequest = Request<{ taTeachingId: string }, {}, {}>;

/**
 * Get a Ta teaching by its id.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const taTeachingId = req.params.taTeachingId;

  const taTeaching = await TaTeachingModel.findById(taTeachingId)
  .populate("taId")
  .populate("courseId")
  .populate("semesterId")

  if (!taTeaching) {
    return res.status(404).json({
      error: {
        message: "Ta teaching not found",
      },
    });
  }

  const response = {
    taTeaching: {
      ...taTeaching.toObject(),
    },
  };

  return res.status(200).json(response);
}

const getTaTeachingByIdHandler = handler;
export default getTaTeachingByIdHandler;