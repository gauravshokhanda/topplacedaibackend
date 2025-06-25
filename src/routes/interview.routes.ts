import express from "express";
import { evaluateInterview,testOpenAIConnection } from "../controllers/interview.controller";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/evaluate", upload.single("audio"), evaluateInterview);
router.get("/test-ai", testOpenAIConnection);

export default router;
