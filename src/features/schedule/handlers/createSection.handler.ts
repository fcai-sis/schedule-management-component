import { SectionModel, SectionType } from "@fcai-sis/shared-models";
import { Request, Response } from "express";
import { ObjectId } from "mongoose";

type HandlerRequest = Request<
  {},
  {},
  {
    section: Omit<SectionType, "semester">;
    course: ObjectId;
    semester: ObjectId;
  }
>;

const createSectionHandler = async (req: HandlerRequest, res: Response) => {
  const { section, course, semester } = req.body;

  const createdSection = await SectionModel.create({
    hall: section.hall,
    slot: section.slot,
    course: course,
    semester: semester,
    group: section.group,
  });

  const response = {
    message: "Section created successfully",
    section: {
      ...createdSection.toJSON(),
      _id: undefined,
      __v: undefined,
    },
  };

  return res.status(201).json(response);
};

export default createSectionHandler;
