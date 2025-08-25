/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb";
import Job from "../../../models/Job";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const location = searchParams.get("location") || "";
    const experienceLevel = searchParams.get("experienceLevel") || "";
    const workMode = searchParams.get("workMode") || "";

    // Build filter object
    const filter: any = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { skills: { $in: [new RegExp(search, "i")] } },
        { searchKeywords: { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (experienceLevel) {
      filter.experienceLevel = experienceLevel;
    }

    if (workMode) {
      filter.workMode = workMode;
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get jobs with pagination
    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Job.countDocuments(filter);

    return NextResponse.json({
      jobs,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const jobData = await request.json();
    const job = new Job(jobData);
    await job.save();

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}
