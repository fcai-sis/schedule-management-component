import {
  AcademicStudentModel,
  BylawModel,
  EnrollmentModel,
  SemesterModel,
  StudentSemesterModel,
} from "@fcai-sis/shared-models";
import env from "../../../env";
import { Request, Response } from "express";
import { ObjectId } from "mongoose";

type HandlerRequest = Request<
  {},
  {},
  {
    semester: ObjectId;
  }
>;

const endSemesterHandler = async (req: HandlerRequest, res: Response) => {
  const { semester } = req.body;
  // loop over all student enrollments with the current semester
  const enrollments = await EnrollmentModel.find({
    semester,
  }).populate("student");

  // loop over all enrollments and calculate the GPA for each student
  // the calculate-student-gpa endpoint returns a response with the student's GPA
  const arrayOfGpasAndTotalCreditHours = await Promise.all(
    enrollments.map(async (enrollment) => {
      const response = await fetch(
        `${env.GPA_CALCULATOR_API}/calculate-student-gpa/${enrollment.student._id}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      return result;
    })
  );

  // assign each student's GPA and total credit hours to the academic student model

  const updatedStudents = enrollments.map(async (enrollment, index) => {
    const student = await AcademicStudentModel.findOne({
      student: enrollment.student._id,
    });

    student.currentGpa = arrayOfGpasAndTotalCreditHours[index].gpa;
    student.completedCreditHours =
      arrayOfGpasAndTotalCreditHours[index].totalCreditHours;

    await student.save();
    // for each student's completed credit hours, check the level the hours fall into, according to the student's bylaw
    const studentBylaw = await BylawModel.findOne({
      _id: enrollment.student.bylaw,
    });
    // loop over the studentBylaw.levelRequirements and check if the student's completed credit hours fall into any of the levels
    // the levelRequirements schema is as follows

    // sort the levelRequirements keys in descending order (so that highest level is checked first)
    const sortedKeys = Object.keys(studentBylaw.levelRequirements).sort(
      (a, b) => parseInt(b) - parseInt(a)
    );
    // loop over the sorted keys and check if the student's completed credit hours fall into any of the levels
    for (const key of sortedKeys) {
      if (
        student.completedCreditHours >=
        studentBylaw.levelRequirements[key].totalHours
      ) {
        student.currentLevel = key;
        break;
      }
    }
  });

  // update the semester status to ended
  const updatedSemester = await SemesterModel.findByIdAndUpdate(
    semester,
    {
      // assign endedAt field to the current date
      endedAt: new Date(),
    },
    { new: true, runValidators: true }
  );

  // create the studentsemester records { consists of a student, a semester, a semesterDate, a semesterGpa, and a semesterLevel }
  const studentSemesters = enrollments.map(async (enrollment) => {
    const academicStudent = await AcademicStudentModel.findOne({
      student: enrollment.student._id,
    });
    const studentSemester = new StudentSemesterModel({
      student: enrollment.student._id,
      semester,
      semesterDate: updatedSemester.createdAt,
      semesterGpa: academicStudent.currentGpa,
      semesterLevel: academicStudent.currentLevel,
    });
    return studentSemester.save();
  });
};

export default endSemesterHandler;
