import { Request, Response } from "express";
import SectionModel from "../../data/models/section.model";
import sectionTeachingsModel from "../../data/models/sectionTeachings.model";

type HandlerRequest = Request<
  {},
  {},
  {
    scheduleId: string;
    hallId: string;
    slotId: string;
    courseId: string;
    taTeachingIds: string[];
  }
>;

//TODO: in delete section, delete all sectionTeachings with sectionId, in update section, update sectionTeachings with sectionId, in get section, get sectionTeachings with sectionId and populate taTeachingId with taTeaching
//TODO: do the same for lecture and check middleware for section and lecture
const handler = async (req: HandlerRequest, res: Response) => {
  const { scheduleId, hallId, slotId, courseId, taTeachingIds } = req.body;


  const section = new SectionModel({
    scheduleId,
    hallId,
    slotId,
    courseId,
  });

  await section.save();

  for (const taTeachingId of taTeachingIds) {
    const sectionTeaching = new sectionTeachingsModel({
      taTeachingId,
      sectionId: section._id,
    });
    await sectionTeaching.save();
  }

  const response = {
    message: "Section created successfully",
    section: {
      ...section.toObject(),
    },
  };

  return res.status(201).json(response);
};

const createSectionHandler = handler;

export default createSectionHandler;
