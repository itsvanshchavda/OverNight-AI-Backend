import { Router } from "express";
import { fileToText } from "../controller/user/student/syllabus/filetotext.js";
import { verifyUser } from "../middleware/verifyuser.js";

const router = Router();

router.post("/file-text", verifyUser, fileToText);

export default router;
