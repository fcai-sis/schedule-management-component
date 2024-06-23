import { InstructorTeachingModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";


type HandlerRequest = Request<
    {},
    {},
    {},
    {
        instructor?: string;
        course?: string;
        semester?: string;
        skip?: number,
        limit?: number
    }
>;


const handler = async (req: HandlerRequest, res: Response) => {
    const { instructor, course, semester, skip, limit } = req.query;
    const page = req.context.page;
    const pageSize = req.context.pageSize;

    const query = {
        ...(instructor && { instructor }),
        ...(course && { course }),
        ...(semester && { semester }),
    };
    const instructorTeaching = await InstructorTeachingModel.find(
        query,
        {
            _v: 0

        },
        {
            skip: skip ?? 0,
            limit: limit as unknown as number,
        }
    );

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