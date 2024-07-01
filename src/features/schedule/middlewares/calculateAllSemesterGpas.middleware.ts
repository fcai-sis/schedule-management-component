import { Request, Response, NextFunction } from "express";
import {
  AcademicStudentModel,
  CourseTypeEnum,
  EnrollmentModel,
  EnrollmentStatusEnum,
  SemesterModel,
  StudentModel,
} from "@fcai-sis/shared-models";

const calculateAllSemesterGpasMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const latestSemester = await SemesterModel.findOne({}).sort({
    createdAt: -1,
  });

  if (!latestSemester)
    return res.status(404).json({ error: { message: "no semester found" } });
  const semester = latestSemester._id;

  // Get latest semester enrollments
  // each student enrollment consists of student, course, semester, termWorkMark, finalExamMark, and grade
  // a student can have multiple enrollments in the same semester
  // we just want a way to get the students of the latest semester, so we only need unique students, not all their enrollments

  const latestUniqueSemesterEnrollments = await EnrollmentModel.find({
    semester,
  })
    .populate("student")
    .distinct("student");

  const students = await StudentModel.find({
    _id: { $in: latestUniqueSemesterEnrollments },
  }).populate("bylaw");

  if (!students || students.length === 0) {
    return res.status(404).json({
      error: {
        message: "No students found",
      },
    });
  }

  const studentGpaDataPromises = students.map(async (student) => {
    const academicStudent = await AcademicStudentModel.findOne({
      student: student._id,
    });

    const enrollments = await EnrollmentModel.find({
      student: student._id,
      semester: semester,
    }).populate("course");

    if (!enrollments || enrollments.length === 0) {
      return {
        studentId: student._id,
        gpa: null,
        mandatoryHours: null,
        electiveHours: null,
      };
    }

    const gradesAccordingToBylaw = enrollments.map((enrollment) => {
      const creditHours = enrollment.course.creditHours;
      const courseType = enrollment.course.courseType;
      const grade = enrollment.termWorkMark + enrollment.finalExamMark;
      let weight = 0;

      // loop over the bylaw.gradeWeights map and find the grade weight
      student.bylaw.gradeWeights.forEach(async (bylawWeight: any, key: any) => {
        if (
          grade >= bylawWeight.percentage.min &&
          grade <= bylawWeight.percentage.max
        ) {
          weight = bylawWeight.weight;

          enrollment.grade = key;
          // TODO: add passCriteria to bylaw so we don't have to hardcode this
          if (grade < 50) {
            enrollment.status = EnrollmentStatusEnum[2];
          } else {
            enrollment.status = EnrollmentStatusEnum[1];
          }
          await enrollment.save();
        }
      });

      if (enrollment.status === EnrollmentStatusEnum[2]) {
        weight = 0;
      }

      return {
        weight,
        creditHours: weight === 0 ? 0 : creditHours,
        courseType,
      };
    });

    const oldGpa = academicStudent.gpa;
    const oldMandatoryHours = academicStudent.mandatoryHours;
    const oldElectiveHours = academicStudent.electiveHours;

    const studentGpa = calculateGPA(
      gradesAccordingToBylaw,
      oldGpa,
      oldMandatoryHours,
      oldElectiveHours
    );

    if (!studentGpa) {
      return {
        studentId: student._id,
        gpa: null,
        mandatoryHours: null,
        electiveHours: null,
      };
    }

    return {
      studentId: student._id,
      gpa: studentGpa.gpa,
      mandatoryHours: studentGpa.mandatoryHours,
      electiveHours: studentGpa.electiveHours,
      bylaw: student.bylaw._id,
    };
  });

  const studentData = await Promise.all(studentGpaDataPromises);

  req.body.studentData = studentData;
  req.body.semester = semester;
  next();
};

export default calculateAllSemesterGpasMiddleware;

function calculateGPA(
  grades: { weight: number; creditHours: number; courseType: string }[],
  oldGpa: number,
  oldMandatoryHours: number,
  oldElectiveHours: number
) {
  let totalWeight = 0;
  let totalCreditHours = 0;
  let mandatoryHours = 0;
  let electiveHours = 0;
  grades.forEach((grade) => {
    totalWeight += grade.weight * grade.creditHours;
    // check courseType, if it's mandatory, add to mandatoryHours, else add to electiveHours
    if (
      grade.courseType === CourseTypeEnum[0] ||
      grade.courseType === CourseTypeEnum[2]
    ) {
      mandatoryHours += grade.creditHours;
    } else {
      electiveHours += grade.creditHours;
    }

    totalCreditHours += grade.creditHours;
  });

  const calculatedGpa = totalWeight / totalCreditHours;
  const newGpa = oldGpa ? (calculatedGpa + oldGpa) / 2 : calculatedGpa;

  const newMandatoryHours = oldMandatoryHours + mandatoryHours;
  const newElectiveHours = oldElectiveHours + electiveHours;

  return {
    gpa: newGpa,
    mandatoryHours: newMandatoryHours,
    electiveHours: newElectiveHours,
  };
}
