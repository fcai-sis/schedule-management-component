import { Router } from "express";
import { asyncHandler } from "@fcai-sis/shared-utilities";

import createLectureHandler from "./handlers/createLecture.handler";
import createSectionHandler from "./handlers/createSection.handler";
// import updateLectureHandler from "./handlers/updateLecture.handler";
// import deleteLectureHandler from "./handlers/deleteLecture.handler";
// import updateSectionHandler from "./handlers/updateSection.handler";
// import deleteSectionHandler from "./handlers/deleteSection.handler";
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
  // router.delete("/lecture/:lectureId", asyncHandler(deleteLectureHandler));

  // Section management
  router.post(
    "/section",
    getLatestSemesterMiddleware,
    validateCreateSectionRequestMiddlware,
    ensureUniqueHallAndSlotMiddleware,
    asyncHandler(createSectionHandler)
  );
  // router.patch("/section/:sectionId", asyncHandler(updateSectionHandler));
  // router.delete("/section/:sectionId", asyncHandler(deleteSectionHandler));

  // Schedule views
  router.get(
    "/schedule/student",
    checkRole([Role.STUDENT]),
    getLatestSemesterMiddleware,
    asyncHandler(getCurrentStudentScheduleHandler)
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
    "/semester/end",
    checkRole([Role.ADMIN]),
    getLatestSemesterMiddleware,
    asyncHandler(endSemesterHandler)
  );

  router.post(
    "/semester/calculate-student-gpa/:studentId",
    checkRole([Role.ADMIN]),
    getLatestSemesterMiddleware,
    asyncHandler(calculateStudentGpaHandler)
  );
};

export default scheduleRoutes;
