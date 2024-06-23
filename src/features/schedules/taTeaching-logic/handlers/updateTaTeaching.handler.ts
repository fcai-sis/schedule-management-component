import { TaTeachingModel, TaTeachingType } from "@fcai-sis/shared-models";
import { Request, Response } from "express";


type HandlerRequest = Request<
  {
    taTeachingId: string;
  },
  {},
  {
    taTeaching: Partial<TaTeachingType>;
  }
>;

/**
 * Update a lecture object.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const taTeachingId = req.params.taTeachingId;
  const { taTeaching } = req.body;

  const updatedTaTeaching = await TaTeachingModel.findByIdAndUpdate(
    taTeachingId,
    {
      ...(taTeaching.ta && { ta: taTeaching.ta }),
      ...(taTeaching.course && { course: taTeaching.course }),
      ...(taTeaching.semester && { semester: taTeaching.semester }),
    },
    { new: true }
  );

  if (!updatedTaTeaching) {
    return res.status(404).json({
      error: {
        message: "Ta teaching not found",
      },
    });
  }

  const response = {
    message: "Ta Teaching updated successfully",
    taTeaching: {
      ...updatedTaTeaching.toObject(),
    },
  };

  return res.status(200).json(response);
};

const updateTaTeachingHandler = handler;

export default updateTaTeachingHandler;
