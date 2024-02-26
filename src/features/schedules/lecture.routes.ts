import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";
import createLectureHandler from "./lecture-logic/handlers/createLecture.handler";
import getLectureHandler from "./lecture-logic/handlers/getLecture.handler";
import { paginationQueryParamsMiddleware } from "@fcai-sis/shared-middlewares";
import getPaginatedLectureHandler from "./lecture-logic/handlers/getPaginatedLecture.handler";


const lecturesRoutes = (router: Router) => {
    router.post(
        "/create",

        asyncHandler(createLectureHandler)
    );

    router.get(
        "/getAll",

        asyncHandler(getLectureHandler)
    );

    router.get(
        "/read",

        paginationQueryParamsMiddleware,

        asyncHandler(getPaginatedLectureHandler)
    );
};

export default lecturesRoutes;