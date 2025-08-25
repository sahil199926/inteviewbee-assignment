"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "./ui/Button";

const SearchFilters: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    location: searchParams.get("location") || "",
    experienceLevel: searchParams.get("experienceLevel") || "",
    workMode: searchParams.get("workMode") || "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    setLoading(true);
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    router.push(`/?${params.toString()}`);
    setTimeout(() => setLoading(false), 500); // Small delay for UX
  };

  const handleClear = () => {
    const clearedFilters = {
      search: "",
      location: "",
      experienceLevel: "",
      workMode: "",
    };
    setFilters(clearedFilters);
    router.push("/");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Search & Filter Jobs
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Jobs
          </label>
          <input
            type="text"
            placeholder="Job title, company, or skills..."
            value={filters.search}
            onChange={(e) => handleInputChange("search", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            placeholder="City or state..."
            value={filters.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Experience Level
          </label>
          <select
            value={filters.experienceLevel}
            onChange={(e) =>
              handleInputChange("experienceLevel", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Levels</option>
            <option value="Entry Level">Entry Level</option>
            <option value="Mid Level">Mid Level</option>
            <option value="Senior Level">Senior Level</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Work Mode
          </label>
          <select
            value={filters.workMode}
            onChange={(e) => handleInputChange("workMode", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Modes</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>
        </div>
      </div>

      <div className="flex space-x-3">
        <Button variant="primary" onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search Jobs"}
        </Button>
        <Button variant="outline" onClick={handleClear} disabled={loading}>
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default SearchFilters;
