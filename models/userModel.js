import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },

    studentInfo: {
      currentYear: {
        type: String,
      },
      university: {
        type: String,
      },
      course: {
        type: String,
      },
      academic_status: {
        type: String,
        enum: ["full-time", "part-time", "graduated"],
        default: "full-time",
      },
      startDate: {
        month: {
          type: String,
          default: "",
        },

        year: {
          type: String,
          default: "",
        },
      },
      endDate: {
        month: {
          type: String,
          empty: true,
          default: "",
        },

        year: {
          type: String,
          empty: true,
          default: "",
        },
      },
      present: {
        type: Boolean,
        default: false,
      },
    },

    role: {
      type: String,
      default: "student",
      enum: ["student", "admin", "teacher", "institution"],
    },

    token: {
      type: String,
    },

    onboarding_step: {
      type: Number,
      default: 0,
    },

    password: {
      type: String,
      default: null,
    },

    name: {
      type: String,
      required: true,
    },

    lastLogin: {
      type: Date,
      default: Date.now,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    googleId: {
      type: String,
    },

    provider: {
      type: String,
      default: "email",
    },

    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
