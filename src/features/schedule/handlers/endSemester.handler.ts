import {
  AcademicStudentModel,
  BylawModel,
  GraduatedStudentModel,
  SemesterModel,
  StudentModel,
  StudentSemesterModel,
} from "@fcai-sis/shared-models";
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
      mandatoryHours: number;
      electiveHours: number;
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
      if (
        !studentGpaData.gpa ||
        !studentGpaData.mandatoryHours ||
        !studentGpaData.electiveHours
      ) {
        return;
      }
      const academicStudent = await AcademicStudentModel.findOne({
        student: studentGpaData.studentId,
      });

      academicStudent.gpa = studentGpaData.gpa;
      academicStudent.mandatoryHours = studentGpaData.mandatoryHours;
      academicStudent.electiveHours = studentGpaData.electiveHours;
      // check if the total credit hours are greater than or equal to the minimum credit hours required for the bylaw
      // if so, set the student isGraduated flag to true
      const studentBylaw = await BylawModel.findOne({
        _id: studentGpaData.bylaw,
      });

      if (
        studentGpaData.mandatoryHours + studentGpaData.electiveHours >=
        50 // TODO: add graduation criteria to bylaw model
      ) {
        academicStudent.isGraduated = true;
      }

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
        isGraduated: false,
      });
      if (!academicStudent) {
        return;
      }
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
          if (
            academicStudent.mandatoryHours >= requirements.mandatoryHours &&
            academicStudent.electiveHours >= requirements.electiveHours
          ) {
            academicStudent.level = level;
            break;
          }
        } else {
          if (
            academicStudent.mandatoryHours + academicStudent.electiveHours >=
            requirements.totalHours
          ) {
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

  const graduatedStudents = await AcademicStudentModel.find({
    isGraduated: true,
  });

  // Move the students who graduated from the Student Model collection to the graduated students collection
  await Promise.all(
    graduatedStudents.map(async (student) => {
      const graduatedStudent = await StudentModel.findOne({
        _id: student.student,
      });

      // the graduated student model schema is the same as the student model schema
      // so we can just create a new graduated student model with the student data
      const newGraduatedStudent = new GraduatedStudentModel({
        ...graduatedStudent.toObject(),
      });

      await newGraduatedStudent.save();
      // await graduatedStudent.deleteOne();
    })
  );

  const response = {
    actions: {
      "Semester Ended": updatedSemester,
    },
    message: "Semester Ended Successfully",
  };

  return res.status(200).json(response);
};

export default endSemesterHandler;
