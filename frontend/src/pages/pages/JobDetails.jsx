
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function JobDetails() {
    const { id } = useParams();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [savedJobIds, setSavedJobIds] = useState(() => {
        const savedJobs = localStorage.getItem("savedJobs");
        return savedJobs ? JSON.parse(savedJobs) : [];
    });

    useEffect(() => {
        localStorage.setItem(
            "savedJobs",
            JSON.stringify(savedJobIds)
        );
    }, [savedJobIds]);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/jobs/${id}/`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Job not found");
                }

                return response.json();
            })
            .then((data) => {
                setJob(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Unable to load job details.");
                setLoading(false);
            });
    }, [id]);

    const toggleSaveJob = () => {
        setSavedJobIds((currentSavedJobs) => {
            if (currentSavedJobs.includes(job.id)) {
                return currentSavedJobs.filter(
                    (savedId) => savedId !== job.id
                );
            }

            return [...currentSavedJobs, job.id];
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-gray-600">
                    Loading job details...
                </p>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-gray-800">
                    Job Not Found
                </h1>

                <Link
                    to="/jobs"
                    className="mt-4 text-blue-600 hover:underline"
                >
                    Back to Jobs
                </Link>
            </div>
        );
    }

    const isSaved = savedJobIds.includes(job.id);

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-5xl mx-auto px-6">
                <div className="bg-white rounded-2xl shadow-sm border p-8">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                        <div>
                            <p className="text-blue-600 font-medium">
                                {job.company}
                            </p>

                            <h1 className="text-3xl font-bold text-gray-900 mt-2">
                                {job.title}
                            </h1>

                            <div className="mt-4 space-y-2 text-gray-600">
                                <p>📍 {job.location}</p>
                                <p>💼 {job.job_type}</p>
                                <p>💰 {job.salary}</p>
                                <p>🎓 {job.experience}</p>
                            </div>
                        </div>

                        <button
                            onClick={toggleSaveJob}
                            className="border px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50"
                        >
                            {isSaved
                                ? "★ Saved"
                                : "☆ Save Job"}
                        </button>
                    </div>

                    <hr className="my-8" />

                    <section>
                        <h2 className="text-xl font-bold text-gray-900">
                            Job Description
                        </h2>

                        <p className="text-gray-600 mt-3 leading-7">
                            {job.description}
                        </p>
                    </section>

                    <section className="mt-8">
                        <h2 className="text-xl font-bold text-gray-900">
                            Required Skills
                        </h2>

                        <div className="flex flex-wrap gap-2 mt-4">
                            {job.skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>

                    <div className="flex flex-col sm:flex-row gap-4 mt-10">
                        <Link
                            to={`/jobs/${job.id}/apply`}
                            className="bg-blue-600 text-white text-center px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                        >
                            Apply Now
                        </Link>

                        <Link
                            to="/jobs"
                            className="border text-gray-700 text-center px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
                        >
                            Back to Jobs
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JobDetails;

