import Project from '../models/project.model.js';
import { errorHandler } from "../utils/error.handler.js";
import { valdiateProject } from '../validations/projects.schema.js';
import fs from 'fs';
import multer from 'multer';



/**
 * @desc create new  project
 * @params POST /api/project/createproject
 * @access PRIVATE (owner of this account)
 **/


export const createProject = async (req, res, next) => {
  const { name, description } = req.body;
  // validate register schema
  const { error } = valdiateProject(req.body);
  if (error) return next(errorHandler(400, `${error.details[0].message}`));
  // check if project already exists
  const existProject = await Project.find({ $or: [{ name }] });
  if (existProject.length) return next(errorHandler(409, "Project already exists"));

  const newProject = new Project({
    name,
    description
  });

  try {
    await newProject.save();
    const projectFolderPath = `./projects/${req.body.name}`;
    fs.mkdirSync(projectFolderPath, { recursive: true });

    // Create additional folders inside the project folder
    const folders= ['Customer', 'System', 'Software'];
    folders.forEach(folderName => {
      const folderPath = `${projectFolderPath}/${folderName}`;
      fs.mkdirSync(folderPath);
    });

    return res.status(201).json({ message: "Project created successfully", status: true, project: newProject });
  } catch (error) {
    next(error);
  }
};




/**
 * @desc upload files
 * @params POST /api/project/upload 
 * @access PRIVATE (owner of this account)
 **/

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const projectFolderPath = `./projects/${req.params.name}`;
    console.log()
    cb(null, projectFolderPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);

  },
});

const upload = multer({ storage });

export const uploadfile = (req, res) => {
  upload.array("files")(req, res, (err) => {
    if (err instanceof multer.MulterError) {

      return res.status(500).send(err.message);
    } else if (err) {

      return res.status(500).send("An error occurred while uploading files.");
    }

    const projectName = req.body.name;
    console.log('Project Name:', projectName);

    if (req.files.length > 0) {
      return res.json({ files: req.files });
    } else {
      return res.send("No files were uploaded.");
    }
  });
};
