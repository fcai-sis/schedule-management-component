import mongoose, { InferSchemaType } from "mongoose";

const scheduleSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
});

export type ScheduleType = InferSchemaType<typeof scheduleSchema>;
export const scheduleModelName = "Schedule";

const Schedule = mongoose.model(scheduleModelName, scheduleSchema);

export default Schedule;
