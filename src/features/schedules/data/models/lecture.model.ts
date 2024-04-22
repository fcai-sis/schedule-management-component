import mongoose, { InferSchemaType } from "mongoose";
import { scheduleModelName } from "./schedule.model";
import {
  courseModelName,
  hallModelName,
  slotModelName,
} from "@fcai-sis/shared-models";
import { ForeignKeyNotFound } from "../../../utils/customError.exception";

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
});

// Pre-save hook to ensure referential integrity
lectureSchema.pre("save", async function (next) {
  try {
    const schedule = await mongoose
      .model(scheduleModelName)
      .findById(this.scheduleId);
    if (!schedule) {
      throw new ForeignKeyNotFound(
        "Schedule not found",
        "foreign-key-not-found"
      );
    }

    const hall = await mongoose.model(hallModelName).findById(this.hallId);
    if (!hall) {
      throw new ForeignKeyNotFound("Hall not found", "foreign-key-not-found");
    }

    const slot = await mongoose.model(slotModelName).findById(this.slotId);
    if (!slot) {
      throw new ForeignKeyNotFound("Slot not found", "foreign-key-not-found");
    }

    const course = await mongoose
      .model(courseModelName)
      .findById(this.courseId);
    if (!course) {
      throw new ForeignKeyNotFound("Course not found", "foreign-key-not-found");
    }
  } catch (error: any) {
    return next(error);
  }

  next();
});

export type LectureType = InferSchemaType<typeof lectureSchema>;
export const lectureModelName = "Lecture";

const LectureModel = mongoose.model(lectureModelName, lectureSchema);

export default LectureModel;
