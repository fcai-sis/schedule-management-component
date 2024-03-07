import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";
import createLectureHandler from "./lecture-logic/handlers/createLecture.handler";
import getLectureHandler from "./lecture-logic/handlers/getLecture.handler";
import { paginationQueryParamsMiddleware } from "@fcai-sis/shared-middlewares";
import getPaginatedLectureHandler from "./lecture-logic/handlers/getPaginatedLecture.handler";
import ensureHallAndSlotUnique from "./lecture-logic/middlewares/ensureHallAndSlotUnique.middleware";
import deleteLectureHandler from "./lecture-logic/handlers/deleteLecture.handler";
import getLectureByIdHandler from "./lecture-logic/handlers/getLectureById.handler";


const lecturesRoutes = (router: Router) => {
    router.post(
        "/create",

        ensureHallAndSlotUnique,

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

    router.get(
        "/:lectureId",

        asyncHandler(getLectureByIdHandler)
    );

    router.delete(
        "/:lectureId",

        asyncHandler(deleteLectureHandler)
    );
};

export default lecturesRoutes;