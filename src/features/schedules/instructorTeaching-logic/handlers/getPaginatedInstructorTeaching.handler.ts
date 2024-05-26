import { InstructorTeachingModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";


type HandlerRequest = Request<
    {
        instructorId?: string;
        courseId?: string;
        semesterId?: string;
    },
    {},
    {}
>;


const handler = async (req: HandlerRequest, res: Response) => {
    const { instructorId, courseId, semesterId } = req.query;
    const page = req.context.page;
    const pageSize = req.context.pageSize;

    const query = {
        ...(instructorId && { instructorId }),
        ...(courseId && { courseId }),
        ...(semesterId && { semesterId }),
    };
    const instructorTeaching = await InstructorTeachingModel.find(query)
        .populate("instructorId")
        .populate("courseId")
        .populate("semesterId")
        .skip((page - 1) * pageSize)
        .limit(pageSize);

    const count = await InstructorTeachingModel.countDocuments(query);
    const totalPages = Math.ceil(count / pageSize);


    const response = {
        lectures: instructorTeaching.map((instructorTeaching) => instructorTeaching.toObject()),
        count,
        totalPages,
        currentPage: page,
        pageSize: pageSize
    };

    return res.status(200).json(response);
};

const getPaginatedInstructorTeachingHandler = handler;
export default getPaginatedInstructorTeachingHandler;