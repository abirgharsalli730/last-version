import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  id: { type: String, required: true },
  summary: { type: String, required: true },
  description: { type: String, required: true},
  projectName: { type: String, required: true },
  createdBy: { type: String, required: true },
  createdTime: { type: Date, required: true },
});

const Issue = mongoose.model("Issue", issueSchema);

export default Issue