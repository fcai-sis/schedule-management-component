import { Request, Response, NextFunction } from "express";
import { ObjectId } from "mongoose";
import {
  AcademicStudentModel,
  EnrollmentModel,
  IStudent,
  SemesterModel,
  StudentModel,
} from "@fcai-sis/shared-models";

type HandlerRequest = Request<{}, {}, {}>;
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

  for (const student of students) {
    const academicStudent = await AcademicStudentModel.findOne({
      student: student._id,
    });

    if (!academicStudent) {
      continue;
    }

    const enrollments = await EnrollmentModel.find({
      student: student._id,
      semester: semester,
    }).populate("course");

    const gradesAccordingToBylaw = enrollments.map((enrollment) => {
      const creditHours = enrollment.course.creditHours;
      const grade = enrollment.termWorkMark + enrollment.finalExamMark;
      let weight = 0;

      // loop over the bylaw.gradeWeights map and find the grade weight
      student.bylaw.gradeWeights.forEach((bylawWeight: any, key: any) => {
        if (
          grade >= bylawWeight.percentage.min &&
          grade <= bylawWeight.percentage.max
        ) {
          weight = bylawWeight.weight;

          enrollment.grade = key;
          enrollment.save();
        }
      });

      return {
        weight,
        creditHours,
      };
    });

    const oldGpa = academicStudent.gpa ? academicStudent.gpa : null;
    const oldTotalCreditHours = academicStudent.creditHours;

    const studentGpa = calculateGPA(
      gradesAccordingToBylaw,
      oldGpa,
      oldTotalCreditHours
    );

    if (!studentGpa) {
      return res.status(500).json({
        error: {
          message: `Error calculating GPA for student ${student._id}`,
        },
      });
    }

    academicStudent.gpa = studentGpa.gpa;
    academicStudent.creditHours = studentGpa.totalCreditHours;

    await academicStudent.save();
  }

  req.body.students = students;
  req.body.semester = semester;
  next();
};

export default calculateAllSemesterGpasMiddleware;

function calculateGPA(
  grades: { weight: number; creditHours: number }[],
  oldGpa: number,
  oldTotalCreditHours: number
) {
  let totalWeight = 0;
  let totalCreditHours = 0;
  grades.forEach((grade) => {
    totalWeight += grade.weight * grade.creditHours;
    totalCreditHours += grade.creditHours;
  });

  const calculatedGpa = totalWeight / totalCreditHours;
  const newGpa = oldGpa ? (calculatedGpa + oldGpa) / 2 : calculatedGpa;

  const newTotalCreditHours = oldTotalCreditHours
    ? totalCreditHours + oldTotalCreditHours
    : totalCreditHours;

  return {
    gpa: newGpa,
    totalCreditHours: newTotalCreditHours,
  };
}
