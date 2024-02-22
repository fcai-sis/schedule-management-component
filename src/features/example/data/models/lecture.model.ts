import mongoose, { InferSchemaType } from "mongoose";
import { scheduleModelName } from "./schedule.model";
import { courseModelName, hallModelName, instructorModelName, slotModelName } from "@fcai-sis/shared-models";

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
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: instructorModelName,
    required: true,
  },
});

export type LectureType = InferSchemaType<typeof lectureSchema>;
export const lectureModelName = "Lecture";

const Lecture = mongoose.model(lectureModelName, lectureSchema);

export default Lecture;
