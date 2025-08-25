"use client";

import React from "react";
import { IJob } from "../../models/Job";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

interface JobCardProps {
  job: IJob;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getExperienceColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "entry level":
      case "junior":
        return "success";
      case "mid level":
      case "intermediate":
        return "warning";
      case "senior level":
      case "senior":
        return "danger";
      default:
        return "default";
    }
  };

  const getWorkModeColor = (mode: string) => {
    switch (mode?.toLowerCase()) {
      case "remote":
        return "success";
      case "hybrid":
        return "warning";
      case "on-site":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              {job.title}
            </h3>
            <p className="text-lg text-blue-600 font-medium">{job.company}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3 h-36">
          <div className="flex items-center text-gray-600">
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            {job.location}
          </div>

          <p className="text-gray-700 text-sm line-clamp-3">
            {job.summary || job.description}
          </p>

          <div className="flex flex-wrap gap-2">
            <Badge variant={getExperienceColor(job.experienceLevel)}>
              {job.experienceLevel}
            </Badge>
            <Badge variant={getWorkModeColor(job.workMode)}>
              {job.workMode}
            </Badge>
            {job.jobTypes.map((type, index) => (
              <Badge key={index} variant="secondary">
                {type}
              </Badge>
            ))}
          </div>

          {job.skills && job.skills.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {job.skills.slice(0, 5).map((skill, index) => (
                <Badge key={index} variant="default" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {job.skills.length > 5 && (
                <Badge variant="default" className="text-xs">
                  +{job.skills.length - 5} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Posted on {formatDate(job.createdAt)}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => window.open(job.sourceUrl, "_blank")}
          >
            Apply Now
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
