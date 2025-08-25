import { Metadata } from "next";
import connectToDatabase from "../lib/mongodb";
import Job from "../models/Job";
import HomePage from "../components/HomePage";

// Generate dynamic metadata based on search parameters
export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { search, location, experienceLevel, workMode } = searchParams;

  let title = "Job Portal Dashboard | Find Your Dream Job";
  let description =
    "Browse thousands of job opportunities from top companies. Filter by location, experience level, and work mode to find the perfect job for you.";

  if (search || location || experienceLevel || workMode) {
    const filters = [];
    if (search) filters.push(search);
    if (location) filters.push(`in ${location}`);
    if (experienceLevel) filters.push(experienceLevel);
    if (workMode) filters.push(workMode);

    title = `${search ? `${search} Jobs` : "Jobs"} ${filters
      .slice(1)
      .join(", ")} | Job Portal Dashboard`;
    description = `Find ${filters.join(
      " "
    )} job opportunities. Browse and apply to the latest job openings from top companies.`;
  }

  return {
    title,
    description,
    keywords:
      "jobs, careers, employment, job search, job portal, hiring, remote jobs, full time, part time",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001",
      siteName: "Job Portal Dashboard",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001",
    },
  };
}

// Generate structured data for SEO
function generateJobSchema(jobs: JobData[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Job Listings",
    description: "Latest job opportunities from top companies",
    numberOfItems: jobs.length,
    itemListElement: jobs.map((job, index) => ({
      "@type": "JobPosting",
      position: index + 1,
      name: job.title,
      description: job.summary || job.description,
      datePosted: job.createdAt,
      validThrough: new Date(
        new Date(job.createdAt).getTime() + 90 * 24 * 60 * 60 * 1000
      ).toISOString(), // 90 days from creation
      employmentType: job.jobTypes?.[0] || "FULL_TIME",
      hiringOrganization: {
        "@type": "Organization",
        name: job.company,
        url: job.sourceUrl,
      },
      jobLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressLocality: job.location,
          addressCountry: "IN",
        },
      },
      baseSalary:
        job.salary?.min && job.salary?.max
          ? {
              "@type": "MonetaryAmount",
              currency: job.salary.currency || "INR",
              value: {
                "@type": "QuantitativeValue",
                minValue: job.salary.min,
                maxValue: job.salary.max,
                unitText: job.salary.period || "YEAR",
              },
            }
          : undefined,
      skills: job.skills?.join(", "),
      experienceRequirements: job.experienceLevel,
      workLocation: job.workMode,
      url: job.sourceUrl,
      identifier: {
        "@type": "PropertyValue",
        name: "Job ID",
        value: job.jobId,
      },
    })),
  };
}

// Generate organization schema
function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Job Portal Dashboard",
    description:
      "Your premier destination for finding dream jobs from top companies",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001",
    logo: process.env.NEXT_PUBLIC_SITE_URL
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`
      : undefined,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["English"],
    },
    sameAs: [],
  };
}

// Generate website schema
function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Job Portal Dashboard",
    description: "Find your dream job from thousands of opportunities",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${
          process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001"
        }?search={search_term}`,
      },
      "query-input": "required name=search_term",
    },
  };
}

interface JobData {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  summary: string;
  requirements: string[];
  salary?: {
    raw: string | null;
    min: number | null;
    max: number | null;
    currency: string;
    period: string | null;
  };
  jobTypes: string[];
  workMode: string;
  sourceUrl: string;
  jobId: string;
  skills: string[];
  experienceLevel: string;
  createdAt: string;
}

interface SearchParams {
  page?: string;
  search?: string;
  location?: string;
  experienceLevel?: string;
  workMode?: string;
}

interface Props {
  searchParams: SearchParams;
}

async function fetchJobs(searchParams: SearchParams) {
  try {
    await connectToDatabase();

    const page = parseInt(searchParams.page || "1");
    const limit = 12;
    const search = searchParams.search || "";
    const location = searchParams.location || "";
    const experienceLevel = searchParams.experienceLevel || "";
    const workMode = searchParams.workMode || "";

    // Build filter object
    const filter: Record<string, unknown> = {};

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

    return {
      jobs: JSON.parse(JSON.stringify(jobs)),
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return {
      jobs: [],
      pagination: {
        current: 1,
        pages: 1,
        total: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  }
}

export default async function Home({ searchParams }: Props) {
  const { jobs, pagination } = await fetchJobs(searchParams);

  // Generate structured data schemas
  const jobSchema = generateJobSchema(jobs);
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            jobSchema,
            organizationSchema,
            websiteSchema,
          ]),
        }}
      />
      <HomePage
        jobs={jobs}
        pagination={pagination}
        searchParams={searchParams}
      />
    </>
  );
}
