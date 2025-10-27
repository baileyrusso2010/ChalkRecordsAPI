import { Router } from "express";
import multer from "multer";
import {
  getFile,
  listClassFiles,
  uploadClassFile,
} from "../controller/file_upload.controller";

const router = Router();
const upload = multer();

router.put("/:classId/upload", upload.single("file"), uploadClassFile);

router.get("/:classId/files", listClassFiles);

router.get("/individual/:fileName", getFile);

export default router;
