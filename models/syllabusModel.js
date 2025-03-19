import mongoose from "mongoose";

const syllabusSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    course: {
      type: String,
    },
    semester: {
      type: String,
    },
    subject: {
      type: Array,
      default: [],
    },

    default_syllabus: {
      text: {
        type: String,
      },

      json: {
        type: Object,
        default: {},
      },
    },

    credit: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Syllabus = mongoose.model("Syllabus", syllabusSchema);
