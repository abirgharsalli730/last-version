import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    
    
    // You can add more fields as needed
  },
  { timestamps: true }
);

const Project = model('Project', projectSchema);

export default Project;
