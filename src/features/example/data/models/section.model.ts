import mongoose, { InferSchemaType } from "mongoose";

const sectionSchema = new mongoose.Schema({
  scheduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Schedule",
    required: true,
  },
  hallId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hall",
    required: true,
  },
  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Slot",
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  assistantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assistant",
    required: true,
  },
});

export type SectionType = InferSchemaType<typeof sectionSchema>;
export const sectionModelName = "Section";

const Section = mongoose.model(sectionModelName, sectionSchema);

export default Section;
