import { courseModelName } from "@fcai-sis/shared-models";
import mongoose, { InferSchemaType } from "mongoose";

// A semester basically consists of a year and a semester type (e.g. "Fall", "Spring", "Summer").
// The semester also has an array of courses, which are the courses that are offered in that semester.

const semesterSchema = new mongoose.Schema({
    year: {
        type: Number,
        required: true,
    },
    semesterType: {
        type: String,
        enum: ["Fall", "Spring", "Summer", "Winter"],
        required: true,
    },
    courseIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: courseModelName,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

// Pre-save hook to ensure referential integrity
semesterSchema.pre("save", async function (next) {
    try {
        const courses = await mongoose
            .model(courseModelName)
            .find({ _id: { $in: this.courseIds } });
        if (courses.length !== this.courseIds.length) {
            throw new Error("Some courses not found");
        }

        next();
    } catch (error: any) {
        return next(error);
    }
});

export type SemesterType = InferSchemaType<typeof semesterSchema>;
export const semesterModelName = "Semester";

const SemesterModel = mongoose.model(semesterModelName, semesterSchema);

export default SemesterModel;

