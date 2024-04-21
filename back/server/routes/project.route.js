import express from "express";
import { createProject } from "../controllers/project.controller.js";
import { uploadfile } from "../controllers/project.controller.js";


const router = express.Router();

router.post("/createproject", createProject );
router.post("/upload/:name", uploadfile );


export default router;