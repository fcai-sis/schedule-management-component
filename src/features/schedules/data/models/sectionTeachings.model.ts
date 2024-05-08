import mongoose, { InferSchemaType } from "mongoose";
import { sectionModelName } from "./section.model";
import { taTeachingModelName } from "./taTeaching.model";
import { ForeignKeyNotFound } from "@fcai-sis/shared-utilities";

const sectionTeachingsSchema = new mongoose.Schema({
  taTeachingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: taTeachingModelName,
    required: true,
  },
  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: sectionModelName,
    required: true,
  },
});

// Pre-save hook to ensure referential integrity
sectionTeachingsSchema.pre("save", async function(next) {
  try {
    const taTeaching = await mongoose
      .model(taTeachingModelName)
      .findById(this.taTeachingId);
    if (!taTeaching) {
      throw new ForeignKeyNotFound("TA Teaching not found");
    }

    const section = await mongoose
      .model(sectionModelName)
      .findById(this.sectionId);
    if (!section) {
      throw new ForeignKeyNotFound("Section not found");
    }

    next();
  } catch (error: any) {
    return next(error);
  }
});

export type sectionTeachingsType = InferSchemaType<
  typeof sectionTeachingsSchema
>;
export const sectionTeachingsModelName = "SectionTeachings";

const SectionTeachingsModel = mongoose.model(
  sectionTeachingsModelName,
  sectionTeachingsSchema
);
export default SectionTeachingsModel;
