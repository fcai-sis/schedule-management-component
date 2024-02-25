import mongoose, { InferSchemaType } from "mongoose";
import { semesterModelName } from "./semester.model";
import { departmentModelName } from "@fcai-sis/shared-models";

const scheduleSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    enum: [1, 2, 3, 4],
    required: true,
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: departmentModelName,
    required: true,
  },

  semesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: semesterModelName,
    required: true,
  },
});

export type ScheduleType = InferSchemaType<typeof scheduleSchema>;
export const scheduleModelName = "Schedule";

const ScheduleModel = mongoose.model(scheduleModelName, scheduleSchema);

export default ScheduleModel;
