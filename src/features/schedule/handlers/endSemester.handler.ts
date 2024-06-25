import {
  AcademicStudentModel,
  BylawModel,
  IStudent,
  SemesterModel,
  StudentSemesterModel,
} from "@fcai-sis/shared-models";
import { Request, Response } from "express";
import { ObjectId } from "mongoose";

type HandlerRequest = Request<
  {},
  {},
  {
    semester: ObjectId;
    students: IStudent[];
  }
>;

const endSemesterHandler = async (req: HandlerRequest, res: Response) => {
  const { semester, students } = req.body;

  // now all students have their GPAs calculated and their total credit hours calculated, both have been assigned to the academic student model
  // we need to assign the level for each student according to their bylaw

  const updatedStudents = students.map(async (student) => {
    const academicStudent = await AcademicStudentModel.findOne({
      student: student._id,
    });
    const studentBylaw = await BylawModel.findOne({
      _id: student.bylaw,
    });

    // loop over the studentBylaw.levelRequirements and check if the student's completed credit hours fall into any of the levels

    // console.log(studentBylaw.levelRequirements);

    // sort the levelRequirements keys in descending order (so that highest level is checked first)
    const sortedLevels = Array.from(studentBylaw.levelRequirements.keys())
      .map(Number)
      .sort((a, b) => b - a);

    // Iterate over the sorted levels and find the appropriate level for the student
    for (const level of sortedLevels) {
      const requirements = studentBylaw.levelRequirements.get(String(level));

      if (studentBylaw.useDetailedHours) {
        console.log("Using detailed hours");

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

    return student.studentId;
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
  const studentSemesters = students.map(async (student) => {
    const academicStudent = await AcademicStudentModel.findOne({
      student: student._id,
    });

    const studentSemester = new StudentSemesterModel({
      student: student._id,
      semester,
      semesterDate: updatedSemester.endedAt,
      cumulativeGpa: academicStudent.gpa,
      semesterLevel: academicStudent.level,
    });

    return studentSemester.save();
  });

  const response = {
    actions: {
      "Semester Ended": updatedSemester,
    },
    message: "Semester Ended Successfully",
  };

  return res.status(200).json(response);
};

export default endSemesterHandler;
