import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";
import ensureHallAndSlotUniqueMiddleware from "./section-logic/middlewares/ensureHallAndSlotUnique.middleware";
import createSectionHandler from "./section-logic/handlers/createSection.handler";
import getSectionHandler from "./section-logic/handlers/getSection.handler";
import { paginationQueryParamsMiddleware } from "@fcai-sis/shared-middlewares";
import getPaginatedSectionHandler from "./section-logic/handlers/getPaginatedSection.handler";
import deleteSectionHandler from "./section-logic/handlers/deleteSection.handler";
import getSectionByIdHandler from "./section-logic/handlers/getSectionById.handler";


const sectionsRoutes = (router: Router) => {
    router.post(
        "/",
        
        ensureHallAndSlotUniqueMiddleware,

        asyncHandler(createSectionHandler)
    );

    router.get(
        "/",

        asyncHandler(getSectionHandler)
    );

    router.get(
        "/read",

        paginationQueryParamsMiddleware,

        asyncHandler(getPaginatedSectionHandler)
    );

    router.get(
        "/:sectionId",

        asyncHandler(getSectionByIdHandler)
    );

    router.delete(
        "/:sectionId",
        
        asyncHandler(deleteSectionHandler)
    );
};

export default sectionsRoutes;