import mongoose, { InferSchemaType } from "mongoose";
import { scheduleModelName } from "./schedule.model";
import {
  courseModelName,
  hallModelName,
  slotModelName,
} from "@fcai-sis/shared-models";
import { instructorTeachingModelName } from "./instructorTeaching.model";

const lectureSchema = new mongoose.Schema({
  scheduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: scheduleModelName,
    required: true,
  },
  hallId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: hallModelName,
    required: true,
  },
  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: slotModelName,
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: courseModelName,
    required: true,
  },
  instructorTeachingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: instructorTeachingModelName,
    required: true,
  },
});

export type LectureType = InferSchemaType<typeof lectureSchema>;
export const lectureModelName = "Lecture";

const LectureModel = mongoose.model(lectureModelName, lectureSchema);

export default LectureModel;

// Pre-save hook to ensure referential integrity
lectureSchema.pre("save", async function (next) {
  try {
    const schedule = await mongoose
      .model(scheduleModelName)
      .findById(this.scheduleId);
    if (!schedule) {
      throw new Error("Schedule not found");
    }

    const hall = await mongoose.model(hallModelName).findById(this.hallId);
    if (!hall) {
      throw new Error("Hall not found");
    }

    const slot = await mongoose.model(slotModelName).findById(this.slotId);
    if (!slot) {
      throw new Error("Slot not found");
    }

    const course = await mongoose
      .model(courseModelName)
      .findById(this.courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    const instructorTeaching = await mongoose
      .model(instructorTeachingModelName)
      .findById(this.instructorTeachingId);
    if (!instructorTeaching) {
      throw new Error("InstructorTeaching not found");
    }
  }
  catch (error: any) {
    return next(error);
  }

  next();
});
