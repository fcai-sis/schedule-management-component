import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";
import createLectureHandler from "./lecture-logic/handlers/createLecture.handler";


const lecturesRoutes = (router: Router) => {
    router.post(
        "/create",
        asyncHandler(createLectureHandler)
    );
};

export default lecturesRoutes;