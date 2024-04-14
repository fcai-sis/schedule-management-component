import mongoose, { InferSchemaType } from "mongoose";
import { scheduleModelName } from "./schedule.model";
import { courseModelName, hallModelName, slotModelName } from "@fcai-sis/shared-models";
import { taTeachingModelName } from "./taTeaching.model";

const sectionSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
  },
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
  TaTeachingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: taTeachingModelName,
    required: true,
  },
});

export type SectionType = InferSchemaType<typeof sectionSchema>;
export const sectionModelName = "Section";

const SectionModel = mongoose.model(sectionModelName, sectionSchema);

export default SectionModel;


// Pre-save hook to ensure referential integrity
sectionSchema.pre("save", async function (next) {
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

    const course = await mongoose.model(courseModelName).findById(this.courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    const taTeaching = await mongoose.model(taTeachingModelName).findById(this.TaTeachingId);
    if (!taTeaching) {
      throw new Error("TA Teaching not found");
    }

    next();
  } catch (error: any) {
    return next(error);
  }
});