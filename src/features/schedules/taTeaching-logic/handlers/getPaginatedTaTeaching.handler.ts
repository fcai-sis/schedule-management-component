import { Request, Response } from "express";
import TaTeachingModel from "../../data/models/taTeaching.model";


type HandlerRequest = Request<
    {
        taId?: string;
        courseId?: string;
        semesterId?: string;
    },
    {},
    {}
>;


const handler = async (req: HandlerRequest, res: Response) => {
    const { taId, courseId, semesterId } = req.query;
    const page = req.context.page;
    const pageSize = req.context.pageSize;

    const query = {
        ...(taId && { taId }),
        ...(courseId && { courseId }),
        ...(semesterId && { semesterId }),
    };
    const taTeaching = await TaTeachingModel.find(query)
    .populate("taId")
        .populate("courseId")
        .populate("semesterId")
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