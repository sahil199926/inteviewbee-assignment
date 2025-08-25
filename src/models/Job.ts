import mongoose from "mongoose";

export interface IJob {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  summary: string;
  requirements: string[];

  postedDate: string;
  jobTypes: string[];
  workMode: string;

  sourceUrl: string;
  jobId: string;
  source: string;
  experienceLevel: string;
  skills: string[];
  scrapedAt: Date;
  createdAt: Date;
  updatedAt: Date;

  searchKeywords: string[];
}

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    summary: { type: String, required: true },
    requirements: [{ type: String }],

    jobTypes: [{ type: String }],
    workMode: { type: String },

    sourceUrl: { type: String, required: true },
    jobId: { type: String, required: true },
    source: { type: String, required: true },
    experienceLevel: { type: String },
    skills: [{ type: String }],
    scrapedAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

    searchKeywords: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Job || mongoose.model("Job", jobSchema);
