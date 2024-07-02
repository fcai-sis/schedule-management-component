import { TaTeachingModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

type HandlerRequest = Request<{ taTeachingId: string }, {}, {}>;

/**
 * Delete a TA Teaching by its id.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const taTeachingId = req.params.taTeachingId;

  const taTeaching = await TaTeachingModel.findByIdAndDelete(taTeachingId);

  if (!taTeaching) {
    return res.status(404).json({
      errors: [
        {
          message: "TA teaching not found",
        },
      ],
    });
  }

  const response = {
    message: "TA teaching deleted successfully",
    taTeaching: {
      ...taTeaching.toObject(),
    },
  };

  return res.status(200).json(response);
};

const deleteTaTeachingHandler = handler;
export default deleteTaTeachingHandler;
