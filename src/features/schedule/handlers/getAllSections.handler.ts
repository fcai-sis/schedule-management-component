import { SectionModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

/**
 * Get all available sections.
 */

type HandlerRequest = Request;

const getAllSectionsHandler = async (req: HandlerRequest, res: Response) => {
  const { skip, limit } = req.query;

  const sections = await SectionModel.find()
    .populate("course")
    .populate("hall")
    .populate("slot")
    .limit(limit as unknown as number)
    .skip(Number(skip) ?? 0);
  console.log(sections);

  const totalSections = await SectionModel.countDocuments();
  return res.status(200).send({
    sections,
    totalSections,
  });
};

export default getAllSectionsHandler;
