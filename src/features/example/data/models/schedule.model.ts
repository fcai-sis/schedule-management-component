import mongoose, { InferSchemaType } from "mongoose";
import { semesterModelName } from "./semester.model";
import { departmentModelName } from "@fcai-sis/shared-models";

const scheduleSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: departmentModelName,
    required: true,
  },

  semester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: semesterModelName,
    required: true,
  },
});

export type ScheduleType = InferSchemaType<typeof scheduleSchema>;
export const scheduleModelName = "Schedule";

const Schedule = mongoose.model(scheduleModelName, scheduleSchema);

export default Schedule;
