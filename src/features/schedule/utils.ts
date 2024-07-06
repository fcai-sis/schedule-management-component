export function formatLecture(lecture: any) {
  return {
    _id: lecture._id.toString(),
    slot: lecture.slot,
    hall: lecture.hall,
    type: "lecture",
    lecture: {
      course: {
        code: lecture.course.code,
        name: lecture.course.name,
      },
      // instructor: {
      //   fullName: lecture.instructor.fullName,
      // },
    },
  };
}

export function formatSection(section: any) {
  return {
    _id: section._id.toString(),
    slot: section.slot,
    hall: section.hall,
    type: "section",
    section: {
      group: section.group,
      course: {
        code: section.course.code,
        name: section.course.name,
      },
      // instructor: {
      //   fullName: section.instructor.fullName,
      // },
    },
  };
}
