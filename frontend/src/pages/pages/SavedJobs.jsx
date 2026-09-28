
import { useState } from "react";
import { Link } from "react-router-dom";
import jobs from "../data/jobs";

function SavedJobs() {
    const [savedJobIds, setSavedJobIds] = useState(() => {
        const savedJobs = localStorage.getItem("savedJobs");

        return savedJobs ? JSON.parse(savedJobs) : [];
    });

    const savedJobs = jobs.filter((job) =>
        savedJobIds.includes(job.id)
    );

    const removeSavedJob = (jobId) => {
        const updatedSavedJobs = savedJobIds.filter(
            (id) => id !== jobId
        );

        setSavedJobIds(updatedSavedJobs);

        localStorage.setItem(
            "savedJobs",
            JSON.stringify(updatedSavedJobs)
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <section className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <Link
                        to="/dashboard"
                        className="text-blue-600 font-medium hover:text-blue-700"
                    >
                        ← Back to Dashboard
                    </Link>

                    <h1 className="text-3xl font-bold text-gray-900 mt-4">
                        Saved Jobs
                    </h1>

                    <p className="text-gray-600 mt-2">
                        Jobs you saved for later.
                    </p>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-6 py-10">
                {savedJobs.length === 0 ? (
                    <div className="bg-white rounded-xl border shadow-sm p-10 text-center">
                        <h2 className="text-xl font-semibold text-gray-900">
                            No saved jobs
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Browse jobs and save the ones you're interested in.
                        </p>

                        <Link
                            to="/jobs"
                            className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                        >
                            Browse Jobs
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {savedJobs.map((job) => (
                            <div
                                key={job.id}
                                className="bg-white rounded-xl border shadow-sm p-6"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            {job.title}
                                        </h2>

                                        <p className="text-gray-600 mt-1">
                                            {job.company}
                                        </p>

                                        <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-500">
                                            <span>{job.location}</span>
                                            <span>•</span>
                                            <span>{job.type}</span>
                                            <span>•</span>
                                            <span>{job.salary}</span>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {job.skills.map((skill) => (
                                                <span
                                                    key={skill}
                                                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Link
                                            to={`/jobs/${job.id}`}
                                            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium text-center hover:bg-blue-700 transition"
                                        >
                                            View Job
                                        </Link>

                                        <button
                                            onClick={() =>
                                                removeSavedJob(job.id)
                                            }
                                            className="px-5 py-2.5 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default SavedJobs;

