import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";
import ensureHallAndSlotUniqueMiddleware from "./section-logic/middlewares/ensureHallAndSlotUnique.middleware";
import createSectionHandler from "./section-logic/handlers/createSection.handler";
import deleteSectionHandler from "./section-logic/handlers/deleteSection.handler";
import ensureSectionIdInParamsMiddleware from "./section-logic/middlewares/ensureSectionIdInParams.middleware";


const sectionsRoutes = (router: Router) => {
    router.post(
        "/",

        ensureHallAndSlotUniqueMiddleware,

        ensureSectionIdInParamsMiddleware,

        asyncHandler(createSectionHandler)
    );

    router.delete(
        "/:sectionId",

        asyncHandler(deleteSectionHandler)
    );
};

export default sectionsRoutes;