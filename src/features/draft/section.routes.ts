import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";
import ensureHallAndSlotUniqueMiddleware from "./section-logic/middlewares/ensureHallAndSlotUnique.middleware";
import createSectionHandler from "../schedule/handlers/createSection.handler";
import deleteSectionHandler from "../schedule/handlers/deleteSection.handler";
import ensureTaAvailbility from "./section-logic/middlewares/ensureTaAvailbility.middleware";
import updateSectionHandler from "../schedule/handlers/updateSection.handler";
import ensureSectionIdInParamsMiddleware from "./section-logic/middlewares/ensureSectionIdInParams.middleware";

const sectionsRoutes = (router: Router) => {
  router.post(
    "/",

    ensureHallAndSlotUniqueMiddleware,

    ensureTaAvailbility,

    asyncHandler(createSectionHandler)
  );

  router.patch(
    "/:sectionId",

    ensureHallAndSlotUniqueMiddleware,

    ensureTaAvailbility,

    ensureSectionIdInParamsMiddleware,

    asyncHandler(updateSectionHandler)
  );
  router.delete(
    "/:sectionId",

    asyncHandler(deleteSectionHandler)
  );
};

export default sectionsRoutes;
