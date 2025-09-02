import { Router } from "express";
import multer from "multer";
import {
  listClassFiles,
  uploadClassFile,
} from "../controller/file_upload.controller";

const router = Router();
const upload = multer();

router.put("/:classId/upload", upload.single("file"), uploadClassFile);

router.get("/:classId/files", listClassFiles);

export default router;
