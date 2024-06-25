import {
  AcademicStudentModel,
  EnrollmentModel,
  StudentModel,
} from "@fcai-sis/shared-models";
import { Request, Response } from "express";
import { ObjectId } from "mongoose";

/*
 * Gets all the grades of a student in the latest semester
 * */

type HandlerRequest = Request<
  {
    studentId: string;
  },
  {},
  {
    semester: ObjectId;
  }
>;
const handler = async (req: HandlerRequest, res: Response) => {
  const { studentId } = req.params;
  const { semester } = req.body;
  // find all enrollments for the student for the specific semester
  const student = await StudentModel.findById(studentId).populate("bylaw");
  if (!student) {
    return res.status(404).json({
      error: {
        message: "Student not found",
      },
    });
  }
  const academicStudent = await AcademicStudentModel.findOne({
    student,
  });

  const enrollments = await EnrollmentModel.find({
    student: studentId,
    semester: semester,
  }).populate("course");

  // each enrollment consists of a termWorkMark, finalExamMark, and grade
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
  const oldTotalCreditHours = academicStudent.totalCreditHours;

  const studentGpa = calculateGPA(
    gradesAccordingToBylaw,
    oldGpa,
    oldTotalCreditHours
  );

  if (!studentGpa) {
    return res.status(500).json({
      error: {
        message: "Error calculating GPA",
      },
    });
  }

  academicStudent.gpa = studentGpa.gpa;
  academicStudent.totalCreditHours = studentGpa.totalCreditHours;

  await academicStudent.save();

  const response = {
    GPA: studentGpa.gpa,
    totalCreditHours: studentGpa.totalCreditHours,
  };

  return res.status(200).json(response);
};

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

const calculateStudentGpaHandler = handler;

export default calculateStudentGpaHandler;
