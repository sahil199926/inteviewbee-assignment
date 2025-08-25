"use client";

import React from "react";
import { IJob } from "../models/Job";
import JobCard from "./JobCard";
import SearchFilters from "./SearchFilters";
import Pagination from "./Pagination";

interface HomePageProps {
  jobs: IJob[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  searchParams: {
    search?: string;
    location?: string;
    experienceLevel?: string;
    workMode?: string;
  };
}

const HomePage: React.FC<HomePageProps> = ({
  jobs,
  pagination,
  searchParams,
}) => {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Job Portal Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Find your dream job from thousands of opportunities
          </p>
        </div>

        {/* Search and Filters */}
        <SearchFilters />

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {jobs.length} of {pagination.total} jobs
            {searchParams.search && (
              <span className="font-medium">
                {" "}
                for &ldquo;{searchParams.search}&rdquo;
              </span>
            )}
          </p>
        </div>

        {/* Job Cards Grid */}
        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {jobs.map((job: IJob) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No jobs found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}

        {/* Pagination */}
        {jobs.length > 0 && (
          <Pagination
            currentPage={pagination.current}
            totalPages={pagination.pages}
            hasNext={pagination.hasNext}
            hasPrev={pagination.hasPrev}
          />
        )}
      </div>
    </main>
  );
};

export default HomePage;
