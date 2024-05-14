import {
  courseModelName,
  instructorModelName,
  semesterModelName,
  teacherAssistantModelName,
} from "@fcai-sis/shared-models";
import mongoose, { InferSchemaType } from "mongoose";
import { ForeignKeyNotFound } from "@fcai-sis/shared-utilities";

const instructorTeachingSchema = new mongoose.Schema({
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: instructorModelName,
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: courseModelName,
    required: true,
  },
  semesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: semesterModelName,
    required: true,
  },
});

// Pre-save hook to ensure referential integrity
instructorTeachingSchema.pre("save", async function(next) {
  try {
    const instructor = await mongoose
      .model(instructorModelName)
      .findById(this.instructorId);
    if (!instructor) {
      throw new ForeignKeyNotFound("Instructor not found");
    }

    const course = await mongoose
      .model(courseModelName)
      .findById(this.courseId);
    if (!course) {
      throw new ForeignKeyNotFound("Course not found");
    }

    const semester = await mongoose
      .model(semesterModelName)
      .findById(this.semesterId);
    if (!semester) {
      throw new ForeignKeyNotFound("Semester not found");
    }

    next();
  } catch (error: any) {
    return next(error);
  }
});

export type InstructorTeachingType = InferSchemaType<
  typeof instructorTeachingSchema
>;
export const instructorTeachingModelName = "InstructorTeaching";

const InstructorTeachingModel = mongoose.model(
  instructorTeachingModelName,
  instructorTeachingSchema
);

export default InstructorTeachingModel;
