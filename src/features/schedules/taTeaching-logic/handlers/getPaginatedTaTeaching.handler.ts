import { TaTeachingModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";


type HandlerRequest = Request<
    {
        ta?: string;
        course?: string;
        semester?: string;
    },
    {},
    {}
>;


const handler = async (req: HandlerRequest, res: Response) => {
    const { ta, course, semester } = req.query;
    const page = req.context.page;
    const pageSize = req.context.pageSize;

    const query = {
        ...(ta && { ta }),
        ...(course && { course }),
        ...(semester && { semester }),
    };
    const taTeaching = await TaTeachingModel.find(query)
    .populate("ta")
        .populate("course")
        .populate("semester")
        .skip((page - 1) * pageSize)
        .limit(pageSize);

    const count = await TaTeachingModel.countDocuments(query);
    const totalPages = Math.ceil(count / pageSize);


    const response = {
        lectures: taTeaching.map((taTeaching) => taTeaching.toObject()),
        count,
        totalPages,
        currentPage: page,
        pageSize: pageSize
    };

    return res.status(200).json(response);
};

const getPaginatedTaTeachingHandler = handler;
export default getPaginatedTaTeachingHandler;