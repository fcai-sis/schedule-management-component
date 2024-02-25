import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";
import createLectureHandler from "./lecture-logic/handlers/createLecture.handler";
import getLectureHandler from "./lecture-logic/handlers/getLecture.handler";


const lecturesRoutes = (router: Router) => {
    router.post(
        "/create",

        asyncHandler(createLectureHandler)
    );

    router.get(
        "/read",

        asyncHandler(getLectureHandler)
    );
};

export default lecturesRoutes;