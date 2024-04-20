import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";
import ensureHallAndSlotUniqueMiddleware from "./section-logic/middlewares/ensureHallAndSlotUnique.middleware";
import createSectionHandler from "./section-logic/handlers/createSection.handler";
import deleteSectionHandler from "./section-logic/handlers/deleteSection.handler";
import ensureTaAvailbility from "./section-logic/middlewares/ensureTAAvailbility.middleware";


const sectionsRoutes = (router: Router) => {
    router.post(
        "/",

        ensureHallAndSlotUniqueMiddleware,

        ensureTaAvailbility,

        asyncHandler(createSectionHandler)
    );

    router.delete(
        "/:sectionId",

        asyncHandler(deleteSectionHandler)
    );
};

export default sectionsRoutes;