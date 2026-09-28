
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api";

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [jobType, setJobType] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchJobs = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await apiFetch("/jobs/");

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail || "Unable to load jobs."
                );
            }

            setJobs(
                Array.isArray(data)
                    ? data
                    : data.results || []
            );
        } catch (error) {
            console.error("Fetch jobs error:", error);

            if (error.message === "SESSION_EXPIRED") {
                setError(
                    "Your session has expired. Please login again."
                );
            } else {
                setError(
                    error.message ||
                        "Unable to load jobs."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter((job) => {
        const searchText = search.toLowerCase().trim();
        const locationText = location.toLowerCase().trim();

        const matchesSearch =
            !searchText ||
            job.title
                ?.toLowerCase()
                .includes(searchText) ||
            job.company
                ?.toLowerCase()
                .includes(searchText) ||
            job.skills?.some((skill) =>
                skill
                    .toLowerCase()
                    .includes(searchText)
            );

        const matchesLocation =
            !locationText ||
            job.location
                ?.toLowerCase()
                .includes(locationText);

        const matchesJobType =
            !jobType ||
            job.job_type === jobType;

        return (
            matchesSearch &&
            matchesLocation &&
            matchesJobType
        );
    });

    return (
        <div className="min-h-screen bg-slate-50">

            {/* Hero / Search Section */}
            <section className="bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-6 py-16">

                    <div className="max-w-3xl">
                        <p className="text-blue-400 font-semibold mb-3">
                            CAREERSYNC JOB MARKETPLACE
                        </p>

                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                            Find your next opportunity
                        </h1>

                        <p className="text-slate-300 mt-4 text-lg">
                            Discover jobs that match your
                            skills, experience, and career goals.
                        </p>
                    </div>

                    {/* Search Box */}
                    <div className="mt-8 bg-white rounded-2xl p-4 shadow-xl">

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Job title, company or skill"
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <input
                                type="text"
                                value={location}
                                onChange={(event) =>
                                    setLocation(
                                        event.target.value
                                    )
                                }
                                placeholder="Location"
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <select
                                value={jobType}
                                onChange={(event) =>
                                    setJobType(
                                        event.target.value
                                    )
                                }
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">
                                    All Job Types
                                </option>

                                <option value="Full Time">
                                    Full Time
                                </option>

                                <option value="Part Time">
                                    Part Time
                                </option>

                                <option value="Internship">
                                    Internship
                                </option>
                            </select>

                        </div>
                    </div>

                </div>
            </section>

            {/* Jobs Section */}
            <main className="max-w-7xl mx-auto px-6 py-12">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            Available Jobs
                        </h2>

                        <p className="text-slate-500 mt-1">
                            {loading
                                ? "Loading jobs..."
                                : `${filteredJobs.length} jobs found`}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setSearch("");
                            setLocation("");
                            setJobType("");
                        }}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                        Clear Filters
                    </button>

                </div>

                {/* Error */}
                {error && (
                    <div className="mb-8 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="bg-white border border-slate-200 rounded-2xl p-6 animate-pulse"
                            >
                                <div className="h-5 bg-slate-200 rounded w-2/3" />

                                <div className="h-4 bg-slate-200 rounded w-1/2 mt-4" />

                                <div className="h-4 bg-slate-200 rounded w-1/3 mt-3" />

                                <div className="h-20 bg-slate-200 rounded mt-6" />

                                <div className="h-10 bg-slate-200 rounded mt-6" />
                            </div>
                        ))}

                    </div>
                )}

                {/* Job Cards */}
                {!loading && filteredJobs.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {filteredJobs.map((job) => (
                            <article
                                key={job.id}
                                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-200"
                            >

                                {/* Job Header */}
                                <div className="flex items-start justify-between gap-4">

                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">
                                            {job.title}
                                        </h3>

                                        <p className="text-slate-600 mt-1">
                                            {job.company}
                                        </p>
                                    </div>

                                    <span className="shrink-0 rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-xs font-semibold">
                                        {job.job_type}
                                    </span>

                                </div>

                                {/* Job Info */}
                                <div className="mt-5 space-y-2 text-sm text-slate-600">

                                    <p>
                                        📍 {job.location}
                                    </p>

                                    <p>
                                        💰 {job.salary}
                                    </p>

                                    <p>
                                        💼 {job.experience}
                                    </p>

                                </div>

                                {/* Skills */}
                                {job.skills &&
                                    job.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-5">

                                            {job.skills
                                                .slice(0, 5)
                                                .map(
                                                    (
                                                        skill,
                                                        index
                                                    ) => (
                                                        <span
                                                            key={`${job.id}-${skill}-${index}`}
                                                            className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                                                        >
                                                            {skill}
                                                        </span>
                                                    )
                                                )}

                                        </div>
                                    )}

                                {/* Description */}
                                <p className="text-sm text-slate-500 mt-5 line-clamp-3">
                                    {job.description}
                                </p>

                                {/* Action */}
                                <Link
                                    to={`/jobs/${job.id}`}
                                    className="block text-center mt-6 w-full rounded-xl bg-slate-900 text-white py-3 font-semibold hover:bg-blue-600 transition"
                                >
                                    View Job
                                </Link>

                            </article>
                        ))}

                    </div>
                )}

                {/* No Jobs */}
                {!loading &&
                    filteredJobs.length === 0 && (
                        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">

                            <div className="text-5xl mb-4">
                                🔎
                            </div>

                            <h3 className="text-xl font-bold text-slate-900">
                                No jobs found
                            </h3>

                            <p className="text-slate-500 mt-2">
                                Try changing your search or
                                filters.
                            </p>

                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setLocation("");
                                    setJobType("");
                                }}
                                className="mt-6 rounded-xl bg-blue-600 text-white px-6 py-3 font-semibold hover:bg-blue-700 transition"
                            >
                                Reset Filters
                            </button>

                        </div>
                    )}

            </main>

        </div>
    );
}

export default Jobs;

