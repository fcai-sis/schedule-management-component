import mongoose, { InferSchemaType } from "mongoose";
import { instructorTeachingModelName } from "./instructorTeaching.model";
import { lectureModelName } from "./lecture.model";


const lectureTeachingsSchema = new mongoose.Schema({
    instructorTeachingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: instructorTeachingModelName,
        required: true,
    },
    lectureId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: lectureModelName,
        required: true,
    },
});

// Pre-save hook to ensure referential integrity
lectureTeachingsSchema.pre("save", async function (next) {
    try {
        const taTeaching = await mongoose.model(instructorTeachingModelName).findById(this.instructorTeachingId);
        if (!taTeaching) {
            throw new Error("Instructor teaching not found");
        }


        const section = await mongoose.model(lectureModelName).findById(this.lectureId);
        if (!section) {
            throw new Error("Lecture not found");
        }

        next();
    } catch (error: any) {
        return next(error);
    }
});

export type lectureTeachingsType = InferSchemaType<typeof lectureTeachingsSchema>;
export const lectureTeachingsModelName = "LectureTeachings";

const LectureTeachingsModel = mongoose.model(lectureTeachingsModelName, lectureTeachingsSchema);
export default LectureTeachingsModel;
