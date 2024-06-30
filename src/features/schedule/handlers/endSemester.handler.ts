import {
  AcademicStudentModel,
  BylawModel,
  SemesterModel,
  StudentSemesterModel,
} from "@fcai-sis/shared-models";
import env from "env";
import { Request, Response } from "express";
import { ObjectId } from "mongoose";

type HandlerRequest = Request<
  {},
  {},
  {
    semester: ObjectId;
    studentData: {
      studentId: ObjectId;
      gpa: number;
      creditHours: number;
      bylaw: ObjectId;
    }[];
  }
>;

const endSemesterHandler = async (req: HandlerRequest, res: Response) => {
  const { semester, studentData } = req.body;

  // now all students have their GPAs calculated and their total credit hours calculated
  // we need to assign the level for each student according to their bylaw

  // loop over studentGpaData and assign the gpa and credit hours to the academic student model
  await Promise.all(
    studentData.map(async (studentGpaData) => {
      if (!studentGpaData.gpa || !studentGpaData.creditHours) {
        return;
      }
      const academicStudent = await AcademicStudentModel.findOne({
        student: studentGpaData.studentId,
      });

      academicStudent.gpa = studentGpaData.gpa;
      academicStudent.creditHours = studentGpaData.creditHours;

      await academicStudent.save();
    })
  );

  await Promise.all(
    studentData.map(async (student) => {
      if (!student.bylaw) {
        return;
      }
      const academicStudent = await AcademicStudentModel.findOne({
        student: student.studentId,
      });
      const studentBylaw = await BylawModel.findOne({
        _id: student.bylaw,
      });

      // loop over the studentBylaw.levelRequirements and check if the student's completed credit hours fall into any of the levels

      // sort the levelRequirements keys in descending order (so that highest level is checked first)
      const sortedLevels = Array.from(studentBylaw.levelRequirements.keys())
        .map(Number)
        .sort((a, b) => b - a);

      // Iterate over the sorted levels and find the appropriate level for the student
      for (const level of sortedLevels) {
        const requirements = studentBylaw.levelRequirements.get(String(level));

        if (studentBylaw.useDetailedHours) {
          // TODO: add mandatory hours and elective hours to academic student model and remove totalCreditHours
          if (
            academicStudent.creditHours >= requirements.mandatoryHours &&
            academicStudent.creditHours <=
              requirements.mandatoryHours + requirements.electiveHours
          ) {
            academicStudent.level = level;
            break;
          }
        } else {
          if (academicStudent.creditHours >= requirements.totalHours) {
            academicStudent.level = level;
            break;
          }
        }
      }

      await academicStudent.save();
    })
  );

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
  await Promise.all(
    studentData.map(async (student) => {
      const academicStudent = await AcademicStudentModel.findOne({
        student: student.studentId,
      });

      const studentSemester = new StudentSemesterModel({
        student: student.studentId,
        semester,
        semesterDate: updatedSemester.endedAt,
        cumulativeGpa: academicStudent.gpa,
        semesterLevel: academicStudent.level,
      });

      await studentSemester.save();
    })
  );

  // // call the assignDepartmentsBasedOnStudentPreferencesHandler endpoint
  // const assignDepartmentsResponse = await fetch(
  //   `${env.STUDENT_PREFERENCE_API}`,
  //   {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   }
  // );

  // if (!assignDepartmentsResponse.ok) {
  //   return res.status(500).json({
  //     error: {
  //       message: "Error assigning departments based on student preferences",
  //     },
  //   });
  // }

  const response = {
    actions: {
      "Semester Ended": updatedSemester,
    },
    message: "Semester Ended Successfully",
  };

  return res.status(200).json(response);
};

export default endSemesterHandler;
