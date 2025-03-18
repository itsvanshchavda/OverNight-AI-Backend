import { Router } from "express";
import { updateUser } from "../controller/user/updateuser.js";
import { verifyUser } from "../middleware/verifyuser.js";
import { addStudentInfo } from "../controller/user/student/addstudentinfo.js";

const router = Router();

router.put("/update-user", verifyUser, updateUser);
router.post("/student-info", verifyUser, addStudentInfo);

export default router;
