import mongoose from "mongoose";

export interface IJob {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  summary: string;
  requirements: string[];
  salary: {
    raw: string | null;
    min: number | null;
    max: number | null;
    currency: string;
    period: string | null;
  };
  jobTypes: string[];
  workMode: string;
  companyRating: number | null;
  companySize: string | null;
  industry: string | null;
  sourceUrl: string;
  jobId: string;
  source: string;
  experienceLevel: string;
  skills: string[];
  scrapedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  dataQuality: {
    score: number;
    filledFields: number;
    totalFields: number;
    missingFields: string[];
  };
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
    salary: {
      raw: { type: String, default: null },
      min: { type: Number, default: null },
      max: { type: Number, default: null },
      currency: { type: String, default: "INR" },
      period: { type: String, default: null },
    },
    jobTypes: [{ type: String }],
    workMode: { type: String },
    companyRating: { type: Number, default: null },
    companySize: { type: String, default: null },
    industry: { type: String, default: null },
    sourceUrl: { type: String, required: true },
    jobId: { type: String, required: true },
    source: { type: String, required: true },
    experienceLevel: { type: String },
    skills: [{ type: String }],
    scrapedAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    dataQuality: {
      score: { type: Number, required: true },
      filledFields: { type: Number, required: true },
      totalFields: { type: Number, required: true },
      missingFields: [{ type: String }],
    },
    searchKeywords: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Job || mongoose.model("Job", jobSchema);
