import { Router } from "express";
import { asyncHandler } from "@fcai-sis/shared-utilities";
import createLectureHandler from "./handlers/createLecture.handler";
import createSectionHandler from "./handlers/createSection.handler";
import getLatestSemesterMiddleware from "./middlewares/getLatestSemester.middleware";
import validateCreateLectureRequestMiddlware from "./middlewares/validateCreateLectureRequest.middleware";
import ensureUniqueHallAndSlotMiddleware from "./middlewares/ensureUniqueHallAndSlot.middleware";
import validateCreateSectionRequestMiddlware from "./middlewares/validateCreateSectionRequest.middleware";
import getCurrentStudentScheduleHandler from "./handlers/getCurrentStudentSchedule.handler";
import { Role, checkRole } from "@fcai-sis/shared-middlewares";
import getCurrentInstructorScheduleHandler from "./handlers/getCurrentInstructorSchedule.handler";
import getCurrentTaScheduleHandler from "./handlers/getCurrentTaSchedule.handler";
import ensureHallIdInParamsMiddleware from "./middlewares/ensureHallIdInParams.middleware";
import getHallScheduleHandler from "./handlers/getHallSchedule.handler";
import getDepartmentScheduleHandler from "./handlers/getDepartmentSchedule.handler";
import ensureDepartmentCodeInParamsMiddleware from "./middlewares/ensureDepartmentCodeInParams.middleware";
import endSemesterHandler from "./handlers/endSemester.handler";
import calculateStudentGpaHandler from "./handlers/calculateStudentGpa.handler";
import calculateLatestSemesterGpas from "./handlers/calculateAllGpas.handler";
import calculateAllSemesterGpasMiddleware from "./middlewares/calculateAllSemesterGpas.middleware";
import startSemesterHandler from "./handlers/startSemester.handler";
import getAuthenticatedInstructorTeachingsHandler from "./handlers/getMyInstructorTeachings.handler";
import getAllLecturesHandler from "./handlers/getAllLectures.handler";
import deleteLectureHandler from "./handlers/deleteLecture.handler";
import getAllSectionsHandler from "./handlers/getAllSections.handler";
import deleteSectionHandler from "./handlers/deleteSection.handler";
import validateCreateInstructorTeachingRequestMiddlware from "./middlewares/validateCreateInstructorTeaching.middleware";
import createInstructorTeachingHandler from "./handlers/createInstructorTeaching.handler";
import ensureLectureIdInParamsMiddleware from "./middlewares/ensureLectureIdInParams.middleware";
import ensureSectionIdInParamsMiddleware from "./middlewares/ensureSectionIdInParams.middleware";
import ensureInstructorTeachingIdInParamsMiddleware from "./middlewares/ensureInstructorTeachingIdInParams.middleware";
import deleteInstructorTeachingHandler from "./handlers/deleteInstructorTeaching.handler";
import validateCreateTaTeachingRequestMiddlware from "./middlewares/validateCreateTaTeaching.middleware";
import createTaTeachingHandler from "./handlers/createTaTeaching.handler";
import ensureTaTeachingIdInParamsMiddleware from "./middlewares/ensureTaTeachingIdInParams.middleware";
import deleteTaTeachingHandler from "./handlers/deleteTaTeaching.handler";
import getAllInstructorTeachingsHandler from "./handlers/getAllInstructorTeachings.handler";
import getAllTaTeachingsHandler from "./handlers/getAllTaTeachings.handler";
import getAuthenticatedTaTeachingsHandler from "./handlers/getMyTaTeachings.handler";
import getEligibleStudentScheduleHandler from "./handlers/getEligibleStudentSchedule.handler";

const scheduleRoutes = (router: Router) => {
  // Lecture management
  router.post(
    "/lecture",
    getLatestSemesterMiddleware,
    validateCreateLectureRequestMiddlware,
    ensureUniqueHallAndSlotMiddleware,
    asyncHandler(createLectureHandler)
  );
  // router.patch("/lecture/:lectureId", asyncHandler(updateLectureHandler));
  router.delete(
    "/lecture/:lectureId",
    ensureLectureIdInParamsMiddleware,
    asyncHandler(deleteLectureHandler)
  );
  router.get("/lectures", asyncHandler(getAllLecturesHandler));

  // Section management
  router.post(
    "/section",
    getLatestSemesterMiddleware,
    validateCreateSectionRequestMiddlware,
    ensureUniqueHallAndSlotMiddleware,
    asyncHandler(createSectionHandler)
  );
  router.get("/sections", asyncHandler(getAllSectionsHandler));
  // router.patch("/section/:sectionId", asyncHandler(updateSectionHandler));
  router.delete(
    "/section/:sectionId",
    ensureSectionIdInParamsMiddleware,
    asyncHandler(deleteSectionHandler)
  );

  // Teaching management

  router.post(
    "/instructor-teaching",
    getLatestSemesterMiddleware,
    validateCreateInstructorTeachingRequestMiddlware,
    asyncHandler(createInstructorTeachingHandler)
  );

  router.get(
    "/instructor-teaching",
    asyncHandler(getAllInstructorTeachingsHandler)
  );

  router.get(
    "/schedule/instructor-teaching/me",
    checkRole([Role.INSTRUCTOR]),
    getLatestSemesterMiddleware,
    asyncHandler(getAuthenticatedInstructorTeachingsHandler)
  );

  router.delete(
    "/instructor-teaching/:instructorTeachingId",
    ensureInstructorTeachingIdInParamsMiddleware,
    asyncHandler(deleteInstructorTeachingHandler)
  );

  router.post(
    "/ta-teaching",
    getLatestSemesterMiddleware,
    validateCreateTaTeachingRequestMiddlware,
    asyncHandler(createTaTeachingHandler)
  );
  router.get("/ta-teaching", asyncHandler(getAllTaTeachingsHandler));

  router.get(
    "/schedule/ta-teaching/me",
    checkRole([Role.TEACHING_ASSISTANT]),
    getLatestSemesterMiddleware,
    asyncHandler(getAuthenticatedTaTeachingsHandler)
  );

  router.delete(
    "/ta-teaching/:taTeachingId",
    ensureTaTeachingIdInParamsMiddleware,
    asyncHandler(deleteTaTeachingHandler)
  );

  // Schedule views
  router.get(
    "/student",
    checkRole([Role.STUDENT]),
    getLatestSemesterMiddleware,
    asyncHandler(getCurrentStudentScheduleHandler)
  );

  router.get(
    "/eligible",
    checkRole([Role.STUDENT]),
    getLatestSemesterMiddleware,
    asyncHandler(getEligibleStudentScheduleHandler)
  );

  router.get(
    "/schedule/instructor",
    checkRole([Role.INSTRUCTOR]),
    getLatestSemesterMiddleware,
    asyncHandler(getCurrentInstructorScheduleHandler)
  );

  router.get(
    "/schedule/ta",
    checkRole([Role.TEACHING_ASSISTANT]),
    getLatestSemesterMiddleware,
    asyncHandler(getCurrentTaScheduleHandler)
  );

  router.get(
    "/schedule/hall/:hallId",
    checkRole([
      Role.ADMIN,
      Role.STUDENT,
      Role.INSTRUCTOR,
      Role.TEACHING_ASSISTANT,
      Role.EMPLOYEE,
    ]),
    ensureHallIdInParamsMiddleware,
    getLatestSemesterMiddleware,
    asyncHandler(getHallScheduleHandler)
  );

  router.get(
    "/schedule/department/:departmentCode",
    checkRole([
      Role.ADMIN,
      Role.STUDENT,
      Role.INSTRUCTOR,
      Role.TEACHING_ASSISTANT,
      Role.EMPLOYEE,
    ]),
    ensureDepartmentCodeInParamsMiddleware,
    getLatestSemesterMiddleware,
    asyncHandler(getDepartmentScheduleHandler)
  );

  // Semester management

  router.post(
    "/semester/start",
    // checkRole([Role.ADMIN]),
    getLatestSemesterMiddleware,
    asyncHandler(startSemesterHandler)
  );

  router.post(
    "/semester/end",
    // checkRole([Role.ADMIN]),
    calculateAllSemesterGpasMiddleware,
    asyncHandler(endSemesterHandler)
  );

  router.post(
    "/semester/calculate-student-gpa/:studentId",
    // checkRole([Role.ADMIN]),
    getLatestSemesterMiddleware,
    asyncHandler(calculateStudentGpaHandler)
  );
  router.post(
    "/semester/calculate-gpas",
    // checkRole([Role.ADMIN]),
    getLatestSemesterMiddleware,
    asyncHandler(calculateLatestSemesterGpas)
  );
};

export default scheduleRoutes;
