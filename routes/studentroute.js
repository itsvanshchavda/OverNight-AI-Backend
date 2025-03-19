import { Router } from "express";
import { verifyUser } from "../middleware/verifyuser.js";
import { addStudentInfo } from "../controller/user/student/addstudentinfo.js";
import { updateStudent } from "../controller/user/updateuser.js";
import { fileToText } from "../controller/user/student/syllabus/filetotext.js";
const router = Router();

router.put("/update-student", verifyUser, updateStudent);
router.post("/student-info", verifyUser, addStudentInfo);

export default router;
