import { Request, Response, NextFunction } from "express";
import {
  AcademicStudentModel,
  EnrollmentModel,
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
        creditHours: null,
      };
    }

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
      return {
        studentId: student._id,
        gpa: null,
        creditHours: null,
      };
    }

    return {
      studentId: student._id,
      gpa: studentGpa.gpa,
      creditHours: studentGpa.totalCreditHours,
      bylaw: student.bylaw._id,
    };
  });

  const studentData = await Promise.all(studentGpaDataPromises);

  req.body.studentData = studentData;
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
