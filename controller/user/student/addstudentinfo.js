import { User } from "../../../models/userModel.js";

// onboarding step 1
export const addStudentInfo = async (req, res) => {
  try {
    const id = req.user._id;

    if (!id) {
      return res.status(400).json({
        error: "Unauthorized user",
      });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    const { studentInfo } = req.body;

    if (!studentInfo) {
      return res.status(400).json({
        error: "Student info is required",
      });
    }

    const {
      university,
      course,
      academic_status,
      startDate,
      endDate,
      present,
      currentYear,
    } = studentInfo;

    if (academic_status) user.academic_status = academic_status;

    if (university) user.studentInfo.university = university;

    if (course) user.studentInfo.course = course;

    if (academic_status) user.studentInfo.academic_status = academic_status;

    if (startDate?.month && startDate?.year) {
      user.studentInfo.startDate.month = startDate.month;
      user.studentInfo.startDate.year = startDate.year;
    }

    if (present !== undefined) user.studentInfo.present = present;

    if (present === true) {
      user.studentInfo.endDate.month = "";
      user.studentInfo.endDate.year = "";
    } else {
      user.studentInfo.endDate.month = endDate?.month;
      user.studentInfo.endDate.year = endDate?.year;
    }

    if (currentYear) {
      user.studentInfo.currentYear = currentYear;
    }

    await user.save();

    res.status(200).json({
      message: "Student info updated successfully",
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
};
