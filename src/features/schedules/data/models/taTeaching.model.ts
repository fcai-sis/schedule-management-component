import {
  courseModelName,
  semesterModelName,
  teachingAssistantName,
} from "@fcai-sis/shared-models";
import mongoose, { InferSchemaType } from "mongoose";
import { ForeignKeyNotFound } from "@fcai-sis/shared-utilities";

const taTeachingSchema = new mongoose.Schema({
  taId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: teachingAssistantName,
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
taTeachingSchema.pre("save", async function(next) {
  try {
    const ta = await mongoose
      .model(teachingAssistantName)
      .findById(this.taId);
    if (!ta) {
      throw new ForeignKeyNotFound("TA not found");
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

export type TaTeachingType = InferSchemaType<typeof taTeachingSchema>;
export const taTeachingModelName = "TaTeaching";

const TaTeachingModel = mongoose.model(taTeachingModelName, taTeachingSchema);

export default TaTeachingModel;
