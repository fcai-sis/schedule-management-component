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
    validate: {
      validator: async function (value: string) {
        const department = await mongoose
          .model(departmentModelName)
          .findById(value.toString());
        return !!department;
      },
      message: "Department not found",
    },
    required: true,
  },

  semesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: semesterModelName,
    validate: {
      validator: async function (value: string) {
        const semester = await mongoose
          .model(semesterModelName)
          .findById(value.toString());
        return !!semester;
      },
      message: "Semester not found",
    },
    required: true,
  },
});

export type ScheduleType = InferSchemaType<typeof scheduleSchema>;
export const scheduleModelName = "Schedule";

const ScheduleModel = mongoose.model(scheduleModelName, scheduleSchema);

export default ScheduleModel;
