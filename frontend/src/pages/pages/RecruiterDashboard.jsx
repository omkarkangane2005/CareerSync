
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api";

function RecruiterDashboard() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const accessToken =
                localStorage.getItem("accessToken");

const response = await fetch(
    "http://127.0.0.1:8000/api/recruiter/jobs/",
    {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    }
);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail || "Unable to load jobs."
                );
            }

            setJobs(data);
        } catch (error) {
            console.error("Recruiter jobs error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const totalApplicants = jobs.reduce(
        (total, job) =>
            total + (job.application_count || 0),
        0
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-600">
                    Loading recruiter dashboard...
                </p>
            </div>
        );
    }

  
const handleDeleteJob = async (jobId) => {
    const confirmed = window.confirm(
        "Are you sure you want to delete this job?"
    );

    if (!confirmed) {
        return;
    }

    try {
        setError("");

        const response = await apiFetch(
            `/jobs/${jobId}/`,
            {
                method: "DELETE",
            }
        );

        if (!response.ok) {
            const data = await response.json();

            throw new Error(
                data.detail ||
                "Unable to delete job."
            );
        }

        setJobs((currentJobs) =>
            currentJobs.filter(
                (job) => job.id !== jobId
            )
        );
    } catch (error) {
        console.error(
            "Delete job error:",
            error
        );

        if (error.message === "SESSION_EXPIRED") {
            setError(
                "Your session has expired. Please login again."
            );
        } else {
            setError(
                error.message ||
                "Unable to delete job."
            );
        }
    }
};


    return (
        <div className="min-h-screen bg-gray-50 px-6 py-10">

            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Recruiter Dashboard
                        </h1>

                        <p className="text-gray-600 mt-2">
                            Manage your job postings and applicants.
                        </p>
                    </div>

                    <Link
                        to="/recruiter/jobs/new"
                        className="bg-blue-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
                    >
                        + Post a Job
                    </Link>

                </div>


                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6">
                        {error}
                    </div>
                )}


                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                    <div className="bg-white border rounded-xl p-6 shadow-sm">
                        <p className="text-gray-500 text-sm">
                            Total Jobs
                        </p>

                        <p className="text-3xl font-bold text-gray-900 mt-2">
                            {jobs.length}
                        </p>
                    </div>


                    <div className="bg-white border rounded-xl p-6 shadow-sm">
                        <p className="text-gray-500 text-sm">
                            Total Applicants
                        </p>

                        <p className="text-3xl font-bold text-gray-900 mt-2">
                            {totalApplicants}
                        </p>
                    </div>


                    <div className="bg-white border rounded-xl p-6 shadow-sm">
                        <p className="text-gray-500 text-sm">
                            Active Jobs
                        </p>

                        <p className="text-3xl font-bold text-gray-900 mt-2">
                            {jobs.length}
                        </p>
                    </div>

                </div>


                {/* Jobs */}
                <div className="bg-white border rounded-xl shadow-sm">

                    <div className="p-6 border-b">
                        <h2 className="text-xl font-bold text-gray-900">
                            My Job Postings
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Jobs posted by your account
                        </p>
                    </div>


                    {jobs.length === 0 ? (
                        <div className="p-10 text-center">

                            <div className="text-5xl mb-4">
                                💼
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900">
                                No jobs posted yet
                            </h3>

                            <p className="text-gray-500 mt-2">
                                Create your first job posting.
                            </p>

                            <Link
                                to="/recruiter/jobs/new"
                                className="inline-block mt-5 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700"
                            >
                                Post a Job
                            </Link>

                        </div>
                    ) : (
                        <div className="divide-y">

                            {jobs.map((job) => (
                                <div
                                    key={job.id}
                                    className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5"
                                >

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {job.title}
                                        </h3>

                                        <p className="text-gray-600 mt-1">
                                            {job.company} • {job.location}
                                        </p>

                                        <p className="text-sm text-gray-500 mt-2">
                                            {job.job_type} • {job.experience}
                                        </p>
                                    </div>

                                    <div className="flex gap-3">
<Link to={`/jobs/${job.id}`}>
    View
</Link>

<Link to={`/recruiter/jobs/${job.id}/edit`}>
    Edit
</Link>

<button onClick={() => handleDeleteJob(job.id)}>
    Delete
</button>

                                    </div>

                                </div>
                            ))}

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}

export default RecruiterDashboard;

