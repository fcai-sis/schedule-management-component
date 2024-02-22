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
    courses: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Course",
    },
    });

export type SemesterType = InferSchemaType<typeof semesterSchema>;
export const semesterModelName = "Semester";

const Semester = mongoose.model(semesterModelName, semesterSchema);

export default Semester;