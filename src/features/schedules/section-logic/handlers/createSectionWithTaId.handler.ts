import { Request, Response } from "express";
import SectionModel from "../../data/models/section.model";
import SemesterModel from "../../data/models/semester.model";
import TaTeachingModel from "../../data/models/taTeaching.model";

type HandlerRequest = Request<
    {},
    {},
    {
        scheduleId: string;
        hallId: string;
        slotId: string;
        courseId: string;
        taId: string;
    }
>;


const handler = async (req: HandlerRequest, res: Response) => {
    const { scheduleId, hallId, slotId, courseId, taId } = req.body;

    const semester = await SemesterModel.findOne().sort({ createdAt: -1 });
    if (!semester) {
        return res.status(400).json({ message: "Semester not found" });
    }

    const taTeaching = await TaTeachingModel.findOne({ taId, courseId, semesterId: semester._id });
    if (!taTeaching) {
        return res.status(400).json({ message: "Ta does not teach this course" });
    }


    const section = new SectionModel({
        scheduleId,
        hallId,
        slotId,
        courseId,
        taTeachingId: taTeaching._id,
    });

    await section.save();
    const response = {
        message: "Section created successfully",
        section: {
            ...section.toObject(),
        },
    };

    return res.status(201).json(response);
};

const createSectionWithTaIdHandler = handler;

export default createSectionWithTaIdHandler;
