import { Request, Response } from "express";
import TaTeachingModel from "../../data/models/taTeaching.model";


type HandlerRequest = Request<
  {
    taTeachingId: string;
  },
  {},
  {
    taId?: string;
    courseId?: string;
    semesterId?: string;
  }
>;

/**
 * Update a lecture object.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const taTeachingId = req.params.taTeachingId;

  const taTeaching = await TaTeachingModel.findByIdAndUpdate(
    taTeachingId,
    { ...req.body },
    { new: true }
  );

  if (!taTeaching) {
    return res.status(404).json({
      error: {
        message: "Ta teaching not found",
      },
    });
  }

  const response = {
    message: "Ta Teaching updated successfully",
    taTeaching: {
      ...taTeaching.toObject(),
    },
  };

  return res.status(200).json(response);
};

const updateTaTeachingHandler = handler;

export default updateTaTeachingHandler;
